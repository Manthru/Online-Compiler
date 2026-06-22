import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { CheckCircle2, Circle, ChevronRight, Search, Tag } from "lucide-react";

const difficultyColor = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    API.get("/api/problems")
      .then((res) => setProblems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Problems</h1>
          <p className="text-zinc-500 text-sm">
            Solve problems and improve your coding skills
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-full"
            />
          </div>

          {/* Difficulty filter */}
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                filter === d
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Problems Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 text-xs text-zinc-500 font-medium uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-3">Tags</div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-600 text-sm">
              Loading problems...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-zinc-600 text-sm">
              No problems found
            </div>
          ) : (
            filtered.map((problem, idx) => (
              <Link
                key={problem._id}
                to={`/problems/${problem.slug}`}
                className="grid grid-cols-12 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group items-center"
              >
                {/* Number */}
                <div className="col-span-1 text-sm text-zinc-600">
                  {problem.order || idx + 1}
                </div>

                {/* Title */}
                <div className="col-span-6 flex items-center gap-2">
                  <span className="text-sm text-white group-hover:text-violet-300 transition-colors font-medium">
                    {problem.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-violet-400 transition-colors" />
                </div>

                {/* Difficulty */}
                <div className="col-span-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="col-span-3 flex gap-1.5 flex-wrap">
                  {problem.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/5 border border-white/10 text-zinc-500 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="flex items-center gap-6 mt-4 text-xs text-zinc-600">
            <span>
              {problems.filter((p) => p.difficulty === "Easy").length} Easy
            </span>
            <span>
              {problems.filter((p) => p.difficulty === "Medium").length} Medium
            </span>
            <span>
              {problems.filter((p) => p.difficulty === "Hard").length} Hard
            </span>
            <span className="ml-auto">{problems.length} total problems</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
