const Groq = require("groq-sdk");
const { zodToJsonSchema } = require("zod-to-json-schema");
const interviewReportSchema = require("./interviewReport.schema");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function generateInterviewReportWithGroq({
    resume,
    selfDescription,
    jobDescription
}) {
    console.log("👉 [FALLBACK MODEL] Running Groq (openai/gpt-oss-20b)...");

    const prompt = `
Generate an interview report for the candidate using the following information.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Generate useful and realistic interview preparation based strictly on the candidate's
resume and the job description.
`;

    const jsonSchema = zodToJsonSchema(interviewReportSchema);

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content:
                    "You are an expert technical interviewer and career preparation assistant. Generate structured interview reports."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_completion_tokens: 8192,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "interview_report",
                strict: true,
                schema: jsonSchema
            }
        }
    });

    const report = JSON.parse(
        response.choices[0].message.content
    );

    console.log("👉 [FALLBACK MODEL] Groq report generated. Validating with Zod...");
    // Validate Groq's response using Zod
    const validatedReport = interviewReportSchema.parse(report);
    console.log("✅ [FALLBACK MODEL] Groq report validated successfully.");

    return validatedReport;
}

module.exports = generateInterviewReportWithGroq;