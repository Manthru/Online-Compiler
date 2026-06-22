const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🔍 Testing AI Review...");
console.log(
  "🔑 GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY
    ? `Found ✅ (${process.env.GEMINI_API_KEY.substring(0, 10)}...)`
    : "MISSING ❌",
);

const { aiCodeReview } = require("./aiCodeReview");

aiCodeReview(`#include<iostream>
using namespace std;
int main(){ 
  cout << "hello";
  return 0; 
}`)
  .then((r) => {
    console.log("✅ Works!");
    console.log(r.substring(0, 300));
  })
  .catch((e) => console.error("❌ Error:", e.message));
