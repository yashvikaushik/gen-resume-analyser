const {GoogleGenAI}=require("@google/genai");
const { model } = require("mongoose");
const z=require("zod")
const {zodToJsonSchema}=require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

async function invokeGeminiAI(){
    const response=await ai.models.generateContent({
        model:"gemini-3.5-flash",
        contents:"Hello gemini ! What is teh capital of india?"
    })

    console.log(response.text)
}

//different from the database schema
//the description in order to fetch the best possible AI response
const interviewReportSchema=z.object({
    technicalQuestions:z.array(z.object({
        question:z.string().description("The technical question can be asked in interview"),
        intend:z.string().description("The intend of the question,i.e.,what the interviewer want to check"),
        answer:z.string().description("How to answer this question, what should be the approach , the points to be covered etc ")
    }.description("The technical question that can be asked in the interview with the intension of the interviewer and how to answer them"))),


    behavioralQuestions:z.array(z.object({
        question:z.string().description("The behavioral question can be asked in interview"),
        intend:z.string().description("The intend of the question,i.e.,what the interviewer want to check"),
        answer:z.string().description("How to answer this question, what should be the approach , the points to be covered etc ")
    }.description("The behavioral question that can be asked in the interview with the intension of the interviewer and how to answer them"))),


    skillGaps:z.array(z.object({
        skill:z.string().description("The skill that the candidate should have and is lacking"),
        severity:z.enum(["low","medium","high"]).description("The severity of the skill gap")
    }.description("The skill that the candidate should have and is lacking"))),


    preparationPlan:z.array(z.object({
        day:z.number().description("The day number in preparation plan starting from day 1 ."),
        focusAreas:z.string().description("The focus areas of the day eg.DSA,Core Java,System Design etc."),
        tasksOfDay:z.array(z.string().description("The tasks of the day"))
    }.description("The preparation plan for the candidate"))),
    matchScore:z.number().description("The match score between the resume and the job description")

})

async function generateInterviewReport({resume,selfDescription,jobDescription}){
   
}

module.exports=invokeGeminiAI