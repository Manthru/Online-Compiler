const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const aiCodeReview = async (code) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an expert code reviewer. Analyze this code and provide:

**Overall Assessment**
What the code does and its quality.

**Issues Found**
Any bugs or edge cases. If none, say "No issues found."

**Improvements**
Performance, readability, best practices.

**Code Quality Score**
Rate X/10 with one-line reason.

Code:
\`\`\`
${code}
\`\`\`

Be concise and beginner-friendly.`,
  });

  if (typeof response.text === "string") {
    return response.text;
  } else if (typeof response.text === "function") {
    return response.text();
  } else {
    return response.candidates[0].content.parts[0].text;
  }
};

module.exports = { aiCodeReview };
