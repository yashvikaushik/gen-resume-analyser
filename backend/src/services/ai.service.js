const { GoogleGenAI } = require("@google/genai");
const { zodToJsonSchema } = require("zod-to-json-schema");
const interviewReportSchema = require("./interviewReport.schema");
const generateInterviewReportWithGroq = require("./groq.service");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isTemporaryError(err) {
    const status =
        err.status ||
        err.statusCode ||
        err.response?.status ||
        (err.error && err.error.code);

    if (status === 429 || (status >= 500 && status <= 599)) {
        return true;
    }

    const message = (err.message || "").toLowerCase();
    return (
        message.includes("429") ||
        message.includes("503") ||
        message.includes("500") ||
        message.includes("502") ||
        message.includes("504") ||
        message.includes("resource_exhausted") ||
        message.includes("unavailable") ||
        message.includes("rate limit") ||
        message.includes("quota") ||
        message.includes("overloaded") ||
        message.includes("timeout") ||
        message.includes("econnreset") ||
        message.includes("fetch failed")
    );
}

async function callGemini(prompt, jsonSchema) {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: jsonSchema
        }
    });

    return JSON.parse(response.text);
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                Resume:${resume}
                Self Description:${selfDescription}
                Job Description:${jobDescription}`;

    const jsonSchema = zodToJsonSchema(interviewReportSchema);

    let rawReport = null;
    let geminiSuccess = false;

    // 1. Initial Gemini 3.6 Flash attempt (MAIN MODEL)
    try {
        console.log(" [MAIN MODEL] Running Gemini 3.6 Flash...");
        rawReport = await callGemini(prompt, jsonSchema);
        geminiSuccess = true;
        console.log(" [MAIN MODEL] Gemini 3.6 Flash succeeded.");
    } catch (err) {
        console.error("[MAIN MODEL] Gemini initial call failed:", err.message);

        // Check if error is temporary (503 / 429 / 5xx)
        if (isTemporaryError(err)) {
            console.log(" [RETRY] Temporary error detected (503 / 429 / 5xx). Starting Retry 1...");

            // Retry 1
            try {
                await sleep(1000);
                rawReport = await callGemini(prompt, jsonSchema);
                geminiSuccess = true;
                console.log("[MAIN MODEL] Gemini succeeded on Retry 1.");
            } catch (retryErr1) {
                console.error(" [RETRY] Gemini Retry 1 failed:", retryErr1.message);

                // Retry 2
                try {
                    console.log("[RETRY] Starting Retry 2...");
                    await sleep(2000);
                    rawReport = await callGemini(prompt, jsonSchema);
                    geminiSuccess = true;
                    console.log("[MAIN MODEL] Gemini succeeded on Retry 2.");
                } catch (retryErr2) {
                    console.error(" [RETRY] Gemini Retry 2 failed:", retryErr2.message);
                }
            }
        } else {
            console.log(" [MAIN MODEL] Non-temporary error encountered on Gemini.");
        }
    }

    // 2. Fallback to Groq if Gemini fails after retries (FALLBACK MODEL)
    if (!geminiSuccess) {
        console.log(" [FALLBACK TRIGGERED] Gemini failed after retries. Switching to GROQ FALLBACK model...");
        return await generateInterviewReportWithGroq({
            resume,
            selfDescription,
            jobDescription
        });
    }

    // 3. ZOD VALIDATION on Gemini response
    console.log(" [ZOD VALIDATION] Validating Gemini report with Zod schema...");
    const validatedReport = interviewReportSchema.parse(rawReport);
    console.log(" [ZOD VALIDATION] Report validated successfully.");
    return validatedReport;
}

module.exports = generateInterviewReport;