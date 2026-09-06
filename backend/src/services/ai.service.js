const {GoogleGenAI}=require("@google/genai");
const { model } = require("mongoose");

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

module.exports=invokeGeminiAI