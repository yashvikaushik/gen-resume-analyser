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

    skillGaps: z.array(
        z.object({
            skill: z.string().describe("The skill that the candidate should have and is lacking"),
            severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
        }).describe("The skill that the candidate should have and is lacking")
    ),

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
