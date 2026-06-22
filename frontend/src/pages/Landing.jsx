import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Code2,
  Zap,
  Brain,
  Trophy,
  TrendingUp,
  ArrowRight,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Online Compiler",
    desc: "Write and execute C++, C, and Python code instantly in your browser with Monaco Editor.",
  },
  {
    icon: Brain,
    title: "AI Code Review",
    desc: "Get intelligent feedback on your code powered by AI.",
  },
  {
    icon: Trophy,
    title: "Coding Challenges",
    desc: "Solve curated DSA problems from easy to hard.",
    badge: "Coming Soon",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    desc: "Track your solving history, streaks, and improvement over time.",
  },
  {
    icon: Zap,
    title: "Contest System",
    desc: "Compete in timed contests with other coders.",
    badge: "Coming Soon",
  },
];

const steps = [
  {
    n: "01",
    title: "Write Code",
    desc: "Use our Monaco-powered editor with full syntax highlighting.",
  },
  {
    n: "02",
    title: "Run Instantly",
    desc: "Execute code in a sandboxed environment, see results in seconds.",
  },
  {
    n: "03",
    title: "Get AI Feedback",
    desc: "AI reviews your logic, edge cases, and style.",
  },
  {
    n: "04",
    title: "Improve Faster",
    desc: "Track what you've learned and build consistent streaks.",
  },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8">
            <Zap className="w-3.5 h-3.5" />
            AI-powered coding platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Practice Coding.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Learn Faster.
            </span>
            <br />
            Get AI Feedback.
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Solve coding problems, run code instantly, and receive AI-powered
            code reviews — all in one place.
          </p>

          {/* Show different buttons based on auth state */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/compiler"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                  Open Compiler
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Start Coding Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Code preview */}
          <div className="mt-16 bg-zinc-900/80 border border-white/10 rounded-xl p-6 text-left font-mono text-sm shadow-2xl max-w-2xl mx-auto">
            <div className="flex gap-1.5 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-zinc-600">main.cpp</span>
            </div>
            <pre className="text-zinc-300 leading-relaxed">
              <span className="text-blue-400">#include</span>{" "}
              <span className="text-green-400">&lt;iostream&gt;</span>
              {"\n"}
              <span className="text-blue-400">using namespace</span>{" "}
              <span className="text-violet-400">std</span>;{"\n\n"}
              <span className="text-yellow-400">int</span>{" "}
              <span className="text-blue-300">main</span>() {"{"}
              {"\n"}
              {"  "}
              <span className="text-zinc-500">
                // AlgoU compiles this instantly ⚡
              </span>
              {"\n"}
              {"  "}cout &lt;&lt;{" "}
              <span className="text-green-400">"Hello, AlgoU!"</span> &lt;&lt;
              endl;{"\n"}
              {"  "}
              <span className="text-blue-400">return</span>{" "}
              <span className="text-orange-400">0</span>;{"\n"}
              {"}"}
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              Everything you need to level up
            </h2>
            <p className="text-zinc-500">
              Built for competitive programmers and developers who want to grow
              fast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors"
              >
                <f.icon className="w-6 h-6 text-violet-400 mb-4" />
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  {f.badge && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
            <p className="text-zinc-500">
              From writing code to getting smarter — in 4 steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="text-3xl font-bold text-white/10 font-mono leading-none pt-1">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-zinc-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start coding?
          </h2>
          <p className="text-zinc-500 mb-8">
            Join AlgoU and start improving your coding skills with AI-powered
            feedback.
          </p>
          {user ? (
            <Link
              to="/compiler"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-8 py-3.5 rounded-lg transition-colors text-lg"
            >
              Open Compiler
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-8 py-3.5 rounded-lg transition-colors text-lg"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-violet-400" />
            <span className="font-bold text-white">AlgoU</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Contact
            </a>
          </div>
          <div className="text-xs text-zinc-700">
            © 2026 AlgoU. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
