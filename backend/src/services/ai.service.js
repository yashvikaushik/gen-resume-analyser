const {GoogleGenAI}=require("@google/genai");
const z=require("zod")
const {zodToJsonSchema}=require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

//different from the database schema
//the description in order to fetch the best possible AI response
const interviewReportSchema=z.object({
    technicalQuestions:z.array(z.object({
        question:z.string().describe("The technical question can be asked in interview"),
        intend:z.string().describe("The intend of the question,i.e.,what the interviewer want to check"),
        answer:z.string().describe("How to answer this question, what should be the approach , the points to be covered etc ")
    }).describe("The technical question that can be asked in the interview with the intension of the interviewer and how to answer them")),


    behavioralQuestions:z.array(z.object({
        question:z.string().describe("The behavioral question can be asked in interview"),
        intend:z.string().describe("The intend of the question,i.e.,what the interviewer want to check"),
        answer:z.string().describe("How to answer this question, what should be the approach , the points to be covered etc ")
    }).describe("The behavioral question that can be asked in the interview with the intension of the interviewer and how to answer them")),


    skillGaps:z.array(z.object({
        skill:z.string().describe("The skill that the candidate should have and is lacking"),
        severity:z.enum(["low","medium","high"]).describe("The severity of the skill gap")
    }).describe("The skill that the candidate should have and is lacking")),


    preparationPlan:z.array(z.object({
        day:z.number().describe("The day number in preparation plan starting from day 1 ."),
        focusAreas:z.string().describe("The focus areas of the day eg.DSA,Core Java,System Design etc."),
        tasksOfDay:z.array(z.string().describe("The tasks of the day"))
    }).describe("The preparation plan for the candidate")),
    matchScore:z.number().describe("The match score between the resume and the job description")

})

async function generateInterviewReport({resume,selfDescription,jobDescription}){
    const prompt=`Generate an interview report for a candidate with the following details:
                Resume:${resume}
                Self Description:${selfDescription}
                Job Description:${jobDescription}`

   const response=await ai.models.generateContent({
    model:"gemini-3.5-flash",
    contents:prompt,
    config:{
        responseMimeType:"application/json",
        responseSchema:zodToJsonSchema(interviewReportSchema)
    }
   })

   const report=JSON.parse(response.text)
   console.log(report)
   return report
}

module.exports=generateInterviewReport