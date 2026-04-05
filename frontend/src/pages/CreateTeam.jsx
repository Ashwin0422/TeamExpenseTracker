import { useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";
import API from "../api/axios";

function BudgetPreview({ teamName, budget, startDate, endDate }) {
  const formatted = parseFloat(budget || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const daysLeft = (() => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / 86400000));
  })();

  const formattedRange = (() => {
    const fmt = (d) =>
      d
        ? new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "—";
    return `${fmt(startDate)} to ${fmt(endDate)}`;
  })();

  return (
    <div className="space-y-4">
      {/* Budget card */}
      <div className="bg-[#141418] border border-white/[0.07] rounded-2xl p-5 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-5">
          <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">
            Budget Preview
          </span>
          <span className="text-emerald-300 text-xs font-semibold tracking-widest uppercase">
            {teamName}
          </span>
          {daysLeft !== null && (
            <span className="text-white/40 text-xs">{daysLeft} days left</span>
          )}
        </div>
        <p className="text-white/40 text-xs mb-1">Allocated Funds</p>
        <p className="text-emerald-400 text-4xl font-bold tracking-tight mb-1">
          ${formatted}
        </p>
        <p className="text-white/30 text-xs mb-5">{formattedRange}</p>

        <div className="mb-2 flex justify-between text-xs text-white/30">
          <span>Used</span>
          <span>0%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full w-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        </div>

        <div className="mt-5 space-y-2.5">
          {[
            "Teams with budgets see 24% less overspending on average.",
            "Real-time tracking enabled by default for all new teams.",
          ].map((tip, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <p className="text-white/50 text-xs leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro tip */}
      {/* <div className="bg-[#141418] border border-white/[0.07] rounded-2xl p-5 flex gap-4">
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-300 text-base">
          💡
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-1">Pro Tip</p>
          <p className="text-white/40 text-xs leading-relaxed">
            Start with a conservative budget. You can adjust team spending limits at
            any time from your settings panel.
          </p>
        </div>
      </div> */}

      {/* Smart analysis banner */}
      <div className="relative rounded-2xl overflow-hidden h-28 hover:-translate-y-0.5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-violet-900/40 to-fuchsia-900/30" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(99,102,241,0.15) 3px, rgba(99,102,241,0.15) 4px)",
          }}
        />
        <div className="absolute bottom-3 left-4">
          <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase border border-white/20 rounded px-2 py-0.5">
            Smart Analysis
          </span>
        </div>
        <div className="absolute top-4 right-4 flex items-end gap-1 h-16">
          {[40, 60, 45, 80, 55, 90, 65, 100, 75, 85].map((h, i) => (
            <div
              key={i}
              className="w-2.5 rounded-sm bg-gradient-to-t from-blue-500/80 to-violet-400/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CreateTeamPage() {
  const today = new Date().toISOString().split("T")[0];
  const [teamName, setTeamName] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [teamCode, setTeamCode] = useState("");

  const { collapsed } = useSidebar();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    console.log({ teamName, budget, startDate, endDate });
    if (new Date(startDate) < new Date() && new Date(endDate) < new Date())
      return;
    try {
      const response = await API.post("/teams/create", {
        teamName,
        budget,
        startDate,
        endDate,
      });
      const data = response.data;
      setTeamCode(data.teamCode);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#111113] text-white transition-all duration-300 ${
        collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
      } pl-0`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .fade-up { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .fade-up.in { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Main */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-5xl mx-4 md:mx-12">
          {/* Header */}
          <div
            className={`fade-up ${mounted ? "in" : ""} mb-10`}
            style={{ transitionDelay: "0.05s" }}
          >
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
              Create a New Team
            </h1>
            <p className="text-white/40 text-sm max-w-md leading-relaxed">
              Enter your team's name and set a budget to get started. You can
              invite members once the team is created.
            </p>
          </div>

          {submitted ? (
            <div className="fade-up in relative bg-[#0f0f13] border border-white/8 rounded-3xl p-10 text-center overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/5 blur-2xl rounded-full" />
              </div>

              {/* Icon */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-md" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-white text-2xl font-semibold tracking-tight mb-2">
                Team Created!
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                <span className="text-white/80 font-medium">{teamName}</span> is
                ready. Start inviting your teammates.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center mt-8">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setTeamName("");
                    setBudget("");
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                >
                  Create Another
                </button>
                <span className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-emerald-400 tracking-widest font-mono">
                  {teamCode}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row flex-wrap items-center gap-6">
              {/* Form */}
              <div
                className={`flex-1 col-span-3 fade-up ${mounted ? "in" : ""} hover:-translate-y-0.5`}
                style={{ transitionDelay: "0.12s" }}
              >
                <div className="bg-[#111114] border border-white/[0.07] rounded-2xl overflow-hidden">
                  {/* Progress bar */}
                  <div className="h-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-transparent" />

                  <div className="p-7 space-y-6">
                    {/* Team Name */}
                    <div>
                      <label className="block text-[11px] font-semibold tracking-widest text-white/40 uppercase mb-2.5">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Design Mavericks"
                        className="w-full bg-[#0f0f12] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-white/20"
                      />
                    </div>

                    {/* Monthly Budget */}
                    <div>
                      <label className="block text-[11px] font-semibold tracking-widest text-white/40 uppercase mb-2.5">
                        Monthly Budget
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="5,000"
                          className="w-full bg-[#0f0f12] border border-white/[0.08] rounded-xl pl-8 pr-4 py-3.5 text-white text-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-white/20"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold tracking-widest text-white/40 uppercase mb-2.5">
                          Start Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-[#0f0f12] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
                          />
                        </div>
                        <p className="text-white/25 text-[11px] mt-1.5 ml-1">
                          Billing cycle begins
                        </p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold tracking-widest text-white/40 uppercase mb-2.5">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-[#0f0f12] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
                        />
                        <p className="text-white/25 text-[11px] mt-1.5 ml-1">
                          Optional expiry date
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !teamName.trim()}
                      className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden
                        bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500
                        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        "Create Team"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview sidebar */}
              <div
                className={`flex-1 col-span-2 fade-up ${mounted ? "in" : ""}`}
                style={{ transitionDelay: "0.22s" }}
              >
                <BudgetPreview
                  teamName={teamName}
                  budget={budget}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
