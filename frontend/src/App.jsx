import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
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
  const [showReview, setShowReview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      setShowReview(true);
    } catch (error) {
      setAiReview("Error in AI review, error: " + error.message);
      setShowReview(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 text-gray-900 p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          💻 CodeWave Compiler
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="rounded-2xl p-5 shadow-lg flex flex-col border border-gray-200 bg-white">
          <h2 className="text-xl font-bold mb-4">Code Editor</h2>
          <div
            className="flex-grow rounded-lg border border-gray-300 overflow-hidden"
            style={{ height: "500px" }}
          >
            <MonacoEditor
              height="100%"
              language="cpp"
              theme="light"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                suggestOnTriggerCharacters: true,
                tabSize: 4,
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
              }}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <div
            className={`grid ${
              showReview ? "grid-cols-2" : "grid-cols-1"
            } gap-4`}
          >
            <div className="rounded-2xl p-4 shadow border border-gray-200 bg-white">
              <h2 className="text-lg font-semibold mb-2">Input</h2>
              <textarea
                rows="7"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input values..."
                className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-blue-400"
              />
            </div>

            <div className="rounded-2xl p-4 shadow border border-gray-200 bg-white col-span-1 xl:col-span-1 xl:h-full">
              <h2 className="text-lg font-semibold mb-2">Output</h2>
              <pre className="text-sm font-mono whitespace-pre-wrap min-h-[14rem]">
                {output}
              </pre>
            </div>
          </div>

          {showReview && (
            <div className="rounded-2xl p-4 shadow border border-gray-200 bg-white col-span-2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">AI Review</h2>
                <button
                  onClick={() => setShowReview(false)}
                  className="text-sm text-red-500 hover:underline"
                >
                  ✖ Close
                </button>
              </div>
              <div className="text-sm prose prose-sm max-w-full">
                {aiReview === "" ? (
                  <p>🤖 Awaiting review...</p>
                ) : (
                  <ReactMarkdown>{aiReview}</ReactMarkdown>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleRun}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
            >
              ▶️ Run
            </button>
            <button
              onClick={handleAiReview}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
            >
              🤖 AI Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
