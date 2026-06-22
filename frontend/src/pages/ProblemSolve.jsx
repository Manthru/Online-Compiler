import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api/axios";
import {
  Play,
  Send,
  ChevronDown,
  Loader2,
  Check,
  X,
  ChevronLeft,
  Terminal,
  BookOpen,
  GripVertical,
  Clock,
  Code2,
  RefreshCw,
} from "lucide-react";

const LANGUAGES = [
  { id: "cpp", label: "C++", mono: "cpp" },
  { id: "c", label: "C", mono: "c" },
  { id: "python", label: "Python", mono: "python" },
];

const difficultyColor = {
  Easy: "text-emerald-400 bg-emerald-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-red-400 bg-red-400/10",
};

const statusStyle = {
  Accepted: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: "✓",
  },
  "Wrong Answer": {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    icon: "✗",
  },
  "Runtime Error": {
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    icon: "!",
  },
  "Time Limit Exceeded": {
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    icon: "⏱",
  },
};

const timeAgo = (date) => {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const ProblemSolve = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [langOpen, setLangOpen] = useState(false);
  const [code, setCode] = useState("");
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeResultTab, setActiveResultTab] = useState("results");
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedTC, setSelectedTC] = useState(0);
  const [leftWidth, setLeftWidth] = useState(42);
  const [expandedSub, setExpandedSub] = useState(null);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const langRef = useRef(null);

  // ── Load problem ──────────────────────────────────────────────────────────
  useEffect(() => {
    API.get(`/api/problems/${slug}`)
      .then((res) => {
        setProblem(res.data);
        setCode(res.data.starterCode?.cpp || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (problem) setCode(problem.starterCode?.[language] || "");
  }, [language]);

  // ── Close dropdown ────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
  const startDrag = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setLeftWidth(
        Math.min(
          Math.max(((e.clientX - rect.left) / rect.width) * 100, 25),
          60,
        ),
      );
    };
    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // ── Fetch submissions ─────────────────────────────────────────────────────
  const loadSubmissions = useCallback(async () => {
    setSubLoading(true);
    try {
      const { data } = await API.get(`/api/problems/${slug}/submissions`);
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setSubLoading(false);
    }
  }, [slug]);

  // ── Run ───────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    setRunLoading(true);
    setRunResult(null);
    setSubmitResult(null);
    setActiveResultTab("results");
    try {
      const { data } = await API.post(`/api/problems/${slug}/run`, {
        code,
        language,
      });
      setRunResult(data.results);
    } catch (err) {
      setRunResult([
        {
          error: err.response?.data?.message || "Execution failed",
          passed: false,
          input: "",
          expectedOutput: "",
          yourOutput: "",
        },
      ]);
    } finally {
      setRunLoading(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitLoading(true);
    setRunResult(null);
    setSubmitResult(null);
    setActiveResultTab("results");
    try {
      const { data } = await API.post(`/api/problems/${slug}/submit`, {
        code,
        language,
      });
      setSubmitResult(data);
      // Switch to submissions tab and reload
      setActiveLeftTab("submissions");
      await loadSubmissions();
    } catch (err) {
      setSubmitResult({
        error: err.response?.data?.message || "Submission failed",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    );

  if (!problem)
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">
        Problem not found.{" "}
        <Link to="/problems" className="text-violet-400 ml-2">
          Go back
        </Link>
      </div>
    );

  const visibleTestCases =
    problem.testCases?.filter((tc) => !tc.isHidden) || [];
  const currentLang = LANGUAGES.find((l) => l.id === language);

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden pt-16">
      {/* ── Top Bar ── */}
      <div className="border-b border-white/5 bg-[#0f0f0f] px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Problems
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-sm font-medium text-white">
            {problem.title}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white transition-all"
            >
              <span
                className={`w-2 h-2 rounded-full ${language === "cpp" ? "bg-blue-400" : language === "c" ? "bg-yellow-400" : "bg-green-400"}`}
              />
              {currentLang?.label}
              <ChevronDown
                className={`w-3 h-3 text-zinc-500 transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors ${language === lang.id ? "bg-violet-600/20 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${lang.id === "cpp" ? "bg-blue-400" : lang.id === "c" ? "bg-yellow-400" : "bg-green-400"}`}
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

          <button
            onClick={handleRun}
            disabled={runLoading || submitLoading}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            {runLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run
          </button>

          <button
            onClick={handleSubmit}
            disabled={runLoading || submitLoading}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg transition-all font-medium"
          >
            {submitLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Left */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col overflow-hidden border-r border-white/5"
        >
          <div className="bg-[#0f0f0f] border-b border-white/5 flex shrink-0">
            <button
              onClick={() => setActiveLeftTab("description")}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 border-b-2 transition-colors ${activeLeftTab === "description" ? "text-white border-violet-500" : "text-zinc-600 border-transparent hover:text-zinc-400"}`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Description
            </button>
            <button
              onClick={() => {
                setActiveLeftTab("submissions");
                loadSubmissions();
              }}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 border-b-2 transition-colors ${activeLeftTab === "submissions" ? "text-white border-violet-500" : "text-zinc-600 border-transparent hover:text-zinc-400"}`}
            >
              <Terminal className="w-3.5 h-3.5" /> Submissions
              {submissions.length > 0 && (
                <span className="ml-1 bg-white/10 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded-full">
                  {submissions.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Description */}
            {activeLeftTab === "description" && (
              <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-white mb-2">
                    {problem.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor[problem.difficulty]}`}
                    >
                      {problem.difficulty}
                    </span>
                    {problem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/5 border border-white/10 text-zinc-500 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </div>
                {problem.examples?.map((ex, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Example {i + 1}:
                    </h3>
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2 font-mono text-sm">
                      <div>
                        <span className="text-zinc-500">Input: </span>
                        <span className="text-zinc-200">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Output: </span>
                        <span className="text-zinc-200">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div>
                          <span className="text-zinc-500">Explanation: </span>
                          <span className="text-zinc-400">
                            {ex.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Constraints:
                    </h3>
                    <ul className="space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li
                          key={i}
                          className="text-sm text-zinc-400 flex items-start gap-2"
                        >
                          <span className="text-zinc-600 mt-1">•</span>
                          <code className="font-mono">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Submissions */}
            {activeLeftTab === "submissions" && (
              <div className="p-4">
                {/* Refresh button */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-500">
                    {submissions.length} submission
                    {submissions.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={loadSubmissions}
                    disabled={subLoading}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${subLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </div>

                {subLoading ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-zinc-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-700 gap-3">
                    <Terminal className="w-8 h-8 opacity-20" />
                    <p className="text-sm">No submissions yet</p>
                    <p className="text-xs text-zinc-600">
                      Submit your solution to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissions.map((sub) => {
                      const s = statusStyle[sub.status] || {
                        text: "text-zinc-400",
                        bg: "bg-white/5",
                        border: "border-white/10",
                        icon: "?",
                      };
                      return (
                        <div
                          key={sub._id}
                          className={`border ${s.border} rounded-xl overflow-hidden`}
                        >
                          <button
                            onClick={() =>
                              setExpandedSub(
                                expandedSub === sub._id ? null : sub._id,
                              )
                            }
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-wrap">
                              {/* Status */}
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.text} ${s.bg} border ${s.border}`}
                              >
                                {s.icon} {sub.status}
                              </span>
                              {/* Score */}
                              <span className="text-xs text-zinc-500">
                                {sub.passedTestCases}/{sub.totalTestCases}{" "}
                                passed
                              </span>
                              {/* Language badge */}
                              <span className="text-xs bg-white/5 border border-white/10 text-zinc-500 px-2 py-0.5 rounded-full">
                                {sub.language === "cpp"
                                  ? "C++"
                                  : sub.language === "python"
                                    ? "Python"
                                    : "C"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-600 shrink-0">
                              <Clock className="w-3 h-3" />
                              {timeAgo(sub.createdAt)}
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${expandedSub === sub._id ? "rotate-180" : ""}`}
                              />
                            </div>
                          </button>

                          {expandedSub === sub._id && (
                            <div className="border-t border-white/5 px-4 py-3 bg-black/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="text-xs text-zinc-500">
                                  Your code
                                </span>
                              </div>
                              <pre className="text-xs text-zinc-300 font-mono bg-white/[0.03] border border-white/5 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-64">
                                {sub.code}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Splitter */}
        <div
          onMouseDown={startDrag}
          className="w-1.5 bg-white/[0.03] hover:bg-violet-500/40 cursor-col-resize flex items-center justify-center group shrink-0 transition-colors"
        >
          <GripVertical className="w-3 h-3 text-zinc-700 group-hover:text-violet-400 transition-colors" />
        </div>

        {/* Right */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="flex flex-col overflow-hidden"
        >
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <div className="bg-[#0f0f0f] border-b border-white/5 px-4 py-1.5 flex items-center gap-2 shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${language === "cpp" ? "bg-blue-400" : language === "c" ? "bg-yellow-400" : "bg-green-400"}`}
              />
              <span className="text-xs text-zinc-500">
                solution.{language === "python" ? "py" : language}
              </span>
            </div>
            <Editor
              height="100%"
              language={currentLang?.mono}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                tabSize: 4,
                wordWrap: "on",
                padding: { top: 12 },
                automaticLayout: true,
                quickSuggestions: true,
              }}
            />
          </div>

          {/* Results */}
          <div className="h-60 shrink-0 border-t border-white/5 flex flex-col">
            <div className="bg-[#0f0f0f] border-b border-white/5 flex shrink-0">
              <button
                onClick={() => setActiveResultTab("results")}
                className={`text-xs font-medium px-4 py-2.5 border-b-2 transition-colors ${activeResultTab === "results" ? "text-white border-violet-500" : "text-zinc-600 border-transparent hover:text-zinc-400"}`}
              >
                Test Results
              </button>
              <button
                onClick={() => setActiveResultTab("testcases")}
                className={`text-xs font-medium px-4 py-2.5 border-b-2 transition-colors ${activeResultTab === "testcases" ? "text-white border-violet-500" : "text-zinc-600 border-transparent hover:text-zinc-400"}`}
              >
                Test Cases
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Test Cases tab */}
              {activeResultTab === "testcases" && (
                <div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {visibleTestCases.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTC(i)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedTC === i ? "bg-violet-600 border-violet-500 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}`}
                      >
                        Case {i + 1}
                      </button>
                    ))}
                  </div>
                  {visibleTestCases[selectedTC] && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">Input</div>
                        <pre className="text-xs text-zinc-300 bg-white/[0.03] border border-white/5 rounded-lg p-3 font-mono">
                          {visibleTestCases[selectedTC].input}
                        </pre>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">
                          Expected Output
                        </div>
                        <pre className="text-xs text-zinc-300 bg-white/[0.03] border border-white/5 rounded-lg p-3 font-mono">
                          {visibleTestCases[selectedTC].output}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results tab */}
              {activeResultTab === "results" && (
                <>
                  {/* Submit verdict */}
                  {submitResult &&
                    !submitResult.error &&
                    (() => {
                      const s = statusStyle[submitResult.status] || {
                        text: "text-zinc-400",
                        bg: "bg-white/5",
                        border: "border-white/10",
                        icon: "?",
                      };
                      return (
                        <div
                          className={`mb-4 px-4 py-3 rounded-lg border ${s.border} ${s.bg} ${s.text} text-sm font-semibold flex items-center gap-2`}
                        >
                          {submitResult.status === "Accepted" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          {submitResult.status} — {submitResult.passedCount}/
                          {submitResult.totalCount} test cases passed
                        </div>
                      );
                    })()}

                  {submitResult?.error && (
                    <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                      {submitResult.error}
                    </div>
                  )}

                  {(runLoading || submitLoading) && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {runLoading
                        ? "Running test cases..."
                        : "Submitting solution..."}
                    </div>
                  )}

                  {!runLoading && !submitLoading && runResult && (
                    <div className="space-y-3">
                      {runResult.map((r, i) => (
                        <div
                          key={i}
                          className={`border rounded-lg p-3 text-xs ${r.passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}
                        >
                          <div className="flex items-center gap-2 mb-2 font-medium">
                            {r.passed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400" />
                            )}
                            <span
                              className={
                                r.passed ? "text-emerald-400" : "text-red-400"
                              }
                            >
                              Case {i + 1} — {r.passed ? "Passed" : "Failed"}
                            </span>
                            {r.runtime && (
                              <span className="text-zinc-600 ml-auto">
                                {r.runtime}ms
                              </span>
                            )}
                          </div>
                          {!r.passed && (
                            <div className="grid grid-cols-2 gap-3 font-mono mt-2">
                              <div>
                                <div className="text-zinc-500 mb-1">Input</div>
                                <pre className="text-zinc-300 bg-black/20 rounded p-2 whitespace-pre-wrap text-xs">
                                  {r.input}
                                </pre>
                              </div>
                              <div>
                                <div className="text-zinc-500 mb-1">
                                  Expected
                                </div>
                                <pre className="text-emerald-300 bg-black/20 rounded p-2 whitespace-pre-wrap text-xs">
                                  {r.expectedOutput}
                                </pre>
                              </div>
                              <div className="col-span-2">
                                <div className="text-zinc-500 mb-1">
                                  Your Output
                                </div>
                                <pre className="text-red-300 bg-black/20 rounded p-2 whitespace-pre-wrap text-xs">
                                  {r.yourOutput || r.error || "No output"}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!runLoading &&
                    !submitLoading &&
                    !runResult &&
                    !submitResult && (
                      <div className="flex flex-col items-center justify-center h-24 text-zinc-700 gap-2">
                        <Play className="w-6 h-6 opacity-20" />
                        <span className="text-xs">
                          Click Run to test or Submit to judge
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

export default ProblemSolve;
