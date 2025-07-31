const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const aiCodeReview = async (code) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Analyze the following code and provide a short and concise review of the code. Also, provide a list of potential improvements and suggestions for the code. " + code,
    });
    return response.text;
};

module.exports = {
    aiCodeReview,
};
