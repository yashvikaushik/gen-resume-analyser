const z = require("zod/v3");

const interviewReportSchema = z.object({
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("The technical question can be asked in interview"),
            intend: z.string().describe("The intend of the question,i.e.,what the interviewer want to check"),
            answer: z.string().describe("How to answer this question, what should be the approach , the points to be covered etc ")
        }).describe("The technical question that can be asked in the interview with the intension of the interviewer and how to answer them")
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("The behavioral question can be asked in interview"),
            intend: z.string().describe("The intend of the question,i.e.,what the interviewer want to check"),
            answer: z.string().describe("How to answer this question, what should be the approach , the points to be covered etc ")
        }).describe("The behavioral question that can be asked in the interview with the intension of the interviewer and how to answer them")
    ),

    skillGaps: z.array(z.object({
    skill: z.string().describe(
        "A specific skill or capability that is genuinely missing or insufficiently demonstrated"
    ),

    severity: z.enum(["low", "medium", "high"]).describe(
        "Severity based on how important the skill is for the job and how much evidence is missing"
    ),

    reason: z.string().describe(
        "Explain why this is considered a gap by comparing the job requirement with evidence from the resume and self-description"
    )
})),

    preparationPlan: z.array(
        z.object({
            day: z.number().describe("The day number in preparation plan starting from day 1 ."),
            focusAreas: z.string().describe("The focus areas of the day eg.DSA,Core Java,System Design etc."),
            tasksOfDay: z.array(z.string().describe("The tasks of the day"))
        }).describe("The preparation plan for the candidate")
    ),

    matchScore: z.number().describe("The match score between the resume and the job description")
});

module.exports = interviewReportSchema;
