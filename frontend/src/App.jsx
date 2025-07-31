import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    int num1, num2, sum;
    cin >> num1 >> num2;
    sum = num1 + num2;
    cout << "The sum of the two numbers is: " << sum;
    return 0;
}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [aiReview, setAiReview] = useState("");

  const handleRun = async () => {
    const payload = {
      language: "cpp",
      code,
      input,
    };

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL,
        payload
      );
      setOutput(data.output);
    } catch (error) {
      setOutput("Error executing code, error: " + error.message);
    }
  };

  const handleAiReview = async () => {
    const payload = {
      code,
    };

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_GOOGLE_GEMINI_API_URL,
        payload
      );
      setAiReview(data.review);
    } catch (error) {
      setAiReview("Error in AI review, error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        My Online Code Compiler
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Code Editor
          </h2>
          <div
            className="bg-gray-100 rounded-lg overflow-y-auto flex-grow"
            style={{ height: "500px" }}
          >
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.js)}
              padding={15}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: "500px",
              }}
            />
          </div>
        </div>

        {/* Input, Output, AI Review */}
        <div className="flex flex-col gap-4">
          {/* Input Box */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Input</h2>
            <textarea
              rows="4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input values..."
              className="w-full p-3 text-sm border border-gray-300 rounded-md resize-none"
            />
          </div>

          {/* Output Box */}
          <div
            className="bg-white shadow-lg rounded-lg p-4 overflow-y-auto"
            style={{ height: "150px" }}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Output</h2>
            <div className="text-sm font-mono whitespace-pre-wrap text-gray-800">
              {output}
            </div>
          </div>

          {/* AI Review Box */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              AI Review
            </h2>
            <div
              className="prose prose-sm text-gray-800 overflow-y-auto"
              style={{ height: "150px" }}
            >
              {aiReview === "" ? (
                <div>🤖</div>
              ) : (
                <ReactMarkdown>{aiReview}</ReactMarkdown>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleRun}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Run
            </button>
            <button
              onClick={handleAiReview}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              AI Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
