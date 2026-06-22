import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Play,
  Sparkles,
  RotateCcw,
  Terminal,
  Loader2,
  Copy,
  Check,
  GripVertical,
  GripHorizontal,
  ChevronDown,
} from "lucide-react";

const LANGUAGES = [
  { id: "cpp", label: "C++", ext: "cpp", mono: "cpp" },
  { id: "c", label: "C", ext: "c", mono: "c" },
  { id: "python", label: "Python", ext: "py", mono: "python" },
];

const DEFAULT_CODE = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Sum: " << a + b << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum: %d\\n", a + b);
    return 0;
}`,
  python: `a, b = map(int, input().split())
print("Sum:", a + b)`,
};

const Compiler = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState("cpp");
  const [langOpen, setLangOpen] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE["cpp"]);
  const [input, setInput] = useState("5 10");
  const [output, setOutput] = useState("");
  const [review, setReview] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const [runLoading, setRunLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [leftWidth, setLeftWidth] = useState(60);
  const [inputHeight, setInputHeight] = useState(30);

  const containerRef = useRef(null);
  const isDraggingH = useRef(false);
  const isDraggingV = useRef(false);
  const rightPanelRef = useRef(null);
  const langRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput("");
    setReview("");
    setError("");
    setLangOpen(false);
  };

  const startHDrag = useCallback((e) => {
    e.preventDefault();
    isDraggingH.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const startVDrag = useCallback((e) => {
    e.preventDefault();
    isDraggingV.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingH.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftWidth(Math.min(Math.max(newLeft, 30), 75));
      }
      if (isDraggingV.current && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect();
        const newTop = ((e.clientY - rect.top) / rect.height) * 100;
        setInputHeight(Math.min(Math.max(newTop, 15), 60));
      }
    };
    const handleMouseUp = () => {
      isDraggingH.current = false;
      isDraggingV.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleRun = async () => {
    setError("");
    setOutput("");
    setActiveTab("output");
    setRunLoading(true);
    try {
      const { data } = await API.post("/run", { language, code, input });
      setOutput(data.output);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Session expired. Please login again."
          : err.response?.data?.error || "Execution failed.",
      );
    } finally {
      setRunLoading(false);
    }
  };

  const handleReview = async () => {
    setError("");
    setReview("");
    setActiveTab("review");
    setReviewLoading(true);
    try {
      const { data } = await API.post("/ai-review", { code });
      setReview(data.review);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Session expired. Please login again."
          : err.response?.data?.error || "AI review failed.",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[language]);
    setInput("5 10");
    setOutput("");
    setReview("");
    setError("");
  };

  const handleCopy = () => {
    const text = activeTab === "output" ? output : review;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const currentLang = LANGUAGES.find((l) => l.id === language);

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden pt-16">
      {/* ── Top Bar ── */}
      <div className="border-b border-white/5 bg-[#0f0f0f] px-4 py-2 flex items-center shrink-0 relative">
        {/* Left — user info */}
        <div className="flex items-center gap-2 w-1/3">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-white">AlgoU</span>
          <span className="text-zinc-700 text-sm">|</span>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              className="w-5 h-5 rounded-full object-cover"
              alt={user.name}
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-violet-700 flex items-center justify-center text-[9px] font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs text-zinc-500 hidden md:block">
            {user?.name}
          </span>
        </div>

        {/* Center — language + action buttons */}
        <div className="flex items-center gap-2 justify-center w-1/3">
          {/* Language Dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-xs text-white font-medium transition-all"
            >
              {/* Language icon */}
              <span
                className={`w-2 h-2 rounded-full ${
                  language === "cpp"
                    ? "bg-blue-400"
                    : language === "c"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                }`}
              />
              {currentLang?.label}
              <ChevronDown
                className={`w-3 h-3 text-zinc-500 transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {langOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${
                      language === lang.id
                        ? "bg-violet-600/20 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        lang.id === "cpp"
                          ? "bg-blue-400"
                          : lang.id === "c"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                      }`}
                    />
                    {lang.label}
                    {language === lang.id && (
                      <Check className="w-3 h-3 text-violet-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* AI Review button */}
          <button
            onClick={handleReview}
            disabled={reviewLoading || runLoading}
            className="flex items-center gap-1.5 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            {reviewLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {reviewLoading ? "Reviewing..." : "AI Review"}
          </button>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={runLoading || reviewLoading}
            className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg transition-all font-medium"
          >
            {runLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            {runLoading ? "Running..." : "Run"}
          </button>
        </div>

        {/* Right — reset */}
        <div className="flex items-center justify-end w-1/3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* ── Main Panels ── */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col overflow-hidden"
        >
          <div className="bg-[#0f0f0f] border-b border-white/5 px-4 py-1.5 flex items-center gap-2 shrink-0">
            <div
              className={`w-2 h-2 rounded-full ${
                language === "cpp"
                  ? "bg-blue-400"
                  : language === "c"
                    ? "bg-yellow-400"
                    : "bg-green-400"
              }`}
            />
            <span className="text-xs text-zinc-500">
              main.{currentLang?.ext}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={currentLang?.mono}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "all",
                tabSize: language === "python" ? 4 : 4,
                wordWrap: "on",
                padding: { top: 12, bottom: 12 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                quickSuggestions: true,
              }}
            />
          </div>
        </div>

        {/* Horizontal Splitter */}
        <div
          onMouseDown={startHDrag}
          className="w-1.5 bg-white/[0.03] hover:bg-violet-500/40 cursor-col-resize flex items-center justify-center group shrink-0 transition-colors"
        >
          <GripVertical className="w-3 h-3 text-zinc-700 group-hover:text-violet-400 transition-colors" />
        </div>

        {/* Right Panel */}
        <div
          ref={rightPanelRef}
          style={{ width: `${100 - leftWidth}%` }}
          className="flex flex-col overflow-hidden bg-[#0d0d0d]"
        >
          {/* Input */}
          <div
            style={{ height: `${inputHeight}%` }}
            className="flex flex-col overflow-hidden shrink-0"
          >
            <div className="bg-[#0f0f0f] border-b border-white/5 px-4 py-1.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-zinc-500">
                  stdin — Standard Input
                </span>
              </div>
              <button
                onClick={() => setInput("")}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Enter input for your program...\nExample: 5 10"}
              className="flex-1 w-full bg-transparent px-4 py-3 text-sm text-zinc-300 placeholder-zinc-700 font-mono resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Vertical Splitter */}
          <div
            onMouseDown={startVDrag}
            className="h-1.5 bg-white/[0.03] hover:bg-violet-500/40 cursor-row-resize flex items-center justify-center group shrink-0 transition-colors"
          >
            <GripHorizontal className="w-3 h-3 text-zinc-700 group-hover:text-violet-400 transition-colors" />
          </div>

          {/* Output / Review */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-[#0f0f0f] border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`text-xs font-medium px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "output"
                      ? "text-white border-violet-500 bg-white/[0.03]"
                      : "text-zinc-600 border-transparent hover:text-zinc-400"
                  }`}
                >
                  Output
                  {output && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`text-xs font-medium px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "review"
                      ? "text-white border-emerald-500 bg-white/[0.03]"
                      : "text-zinc-600 border-transparent hover:text-zinc-400"
                  }`}
                >
                  AI Review
                  {review && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>
              {(output || review) && !error && (
                <button
                  onClick={handleCopy}
                  className="mr-3 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 px-2 py-1 rounded hover:bg-white/5 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg font-mono whitespace-pre-wrap">
                  ⚠ {error}
                </div>
              )}

              {activeTab === "output" && !error && (
                <>
                  {runLoading ? (
                    <div className="flex flex-col items-center justify-center h-24 gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                      <span className="text-xs text-zinc-500">
                        {language === "python"
                          ? "Running Python..."
                          : "Compiling and running..."}
                      </span>
                    </div>
                  ) : output ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs text-zinc-500">
                          Program output
                        </span>
                      </div>
                      <pre className="text-sm text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed bg-white/[0.03] border border-white/5 rounded-lg p-4">
                        {output}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-zinc-700 gap-2">
                      <Play className="w-7 h-7 opacity-20" />
                      <span className="text-xs">
                        Press Run to execute your code
                      </span>
                    </div>
                  )}
                </>
              )}

              {activeTab === "review" && !error && (
                <>
                  {reviewLoading ? (
                    <div className="flex flex-col items-center justify-center h-24 gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                      <span className="text-xs text-zinc-500">
                        Gemini is analyzing your code...
                      </span>
                    </div>
                  ) : review ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-zinc-500">
                          Gemini AI Review
                        </span>
                      </div>
                      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap bg-white/[0.03] border border-white/5 rounded-lg p-4">
                        {review}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-zinc-700 gap-2">
                      <Sparkles className="w-7 h-7 opacity-20" />
                      <span className="text-xs">
                        Press AI Review to analyze your code
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
