import { useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import API from "../api/axios";
import {useNavigate} from "react-router-dom";

const avatars = [
  { bg: "bg-purple-500", initials: "A" },
  { bg: "bg-blue-500", initials: "S" },
  { bg: "bg-green-500", initials: "H" },
];

export default function JoinTeam() {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { collapsed } = useSidebar();
  const Navigate = useNavigate();

  const handleJoin = async () => {
    if (!code.trim()) {
      setError("Please enter an invite code.");
      return;
    }
    setError("");
    try {
        const response = await API.post("/teams/join",{teamCode: code})
        console.log(response)
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setCode("");
        }, 2000)
    }catch(err) {
        console.log(err)
        setError(err?.response?.data?.message || "Something went wrong");
        setCode("");
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value);
    if (error) setError("");
  };

  const navigatetoDashboard = () => {
    Navigate("/");
  };


  return (
    <div
      className={`min-h-screen bg-[#111113] text-white font-sans flex flex-col ${
        collapsed ? "lg:pl-[0px]" : "lg:pl-[32px]"
      }`}
    >
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-start px-4 sm:px-8  py-16 sm:py-12 w-full max-w-4xl mx-auto">
        {/* Label */}
        <p className="text-[#a78bfa] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
          Onboarding
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
          Join an Existing Team
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-sm sm:text-base mb-7 sm:mb-10 max-w-md leading-relaxed">
          Enter the unique invite code shared by your team lead to start
          managing expenses together.
        </p>

        {/* Card */}
        <div className="w-full bg-[#1c1b2e] border border-white/10 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-stretch sm:items-center shadow-2xl">
          {/* Left: Form */}
          <div className="flex-1 flex flex-col gap-5">
            <div>
              <label className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2 block">
                Team Invite Code
              </label>
              <input
                type="text"
                value={code}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="XXXX - XXXX"
                className={`w-full bg-[#111113] border rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white placeholder-white/20 text-sm sm:text-base outline-none transition-all duration-200 tracking-widest font-mono ${
                  focused
                    ? "border-[#a78bfa] shadow-[0_0_0_3px_rgba(167,139,250,0.12)]"
                    : error
                      ? "border-red-500/60"
                      : "border-white/10"
                }`}
              />
              {error ? (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              ) : (
                <p className="text-white/25 text-xs mt-2 flex items-center gap-1.5">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 8v4m0 4h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Codes are case-sensitive and usually 8 characters long.
                </p>
              )}
            </div>

            <button
              onClick={handleJoin}
              className={`flex items-center justify-center gap-2 w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all duration-200 ${
                submitted
                  ? "bg-green-500 text-white scale-[0.98]"
                  : "bg-[#a78bfa] hover:bg-[#9166f8] text-[#1c1b2e] hover:scale-[1.01] active:scale-[0.98]"
              } shadow-lg`}
            >
              {submitted ? (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Submitted
                </>
              ) : (
                <>
                  Join Team
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M5 12h14m-7-7 7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Right: Social Proof Card */}
          <div className="w-full sm:w-52 lg:w-56 bg-[#111113] rounded-xl overflow-hidden flex flex-row sm:flex-col border border-white/5 flex-shrink-0">
            {/* Decorative area — vertical strip on mobile, full top block on sm+ */}
            <div className="relative w-16 sm:w-full h-auto sm:h-28 bg-gradient-to-b sm:bg-gradient-to-br from-[#2d2040] to-[#1a1a2e] flex items-center justify-center flex-shrink-0">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(167,139,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.5) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
              <div className="w-9 h-12 sm:w-16 sm:h-20 rounded-t-full bg-white/5 border border-white/10 flex items-end justify-center overflow-hidden">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/10 mb-1" />
              </div>
            </div>

            {/* Info */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
              <div className="flex items-center mb-2">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${a.bg} border-2 border-[#111113] flex items-center justify-center text-xs font-bold text-white`}
                    style={{ marginLeft: i === 0 ? 0 : -7 }}
                  >
                    {a.initials}
                  </div>
                ))}
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#a78bfa] border-2 border-[#111113] flex items-center justify-center text-xs font-bold text-white"
                  style={{ marginLeft: -7 }}
                >
                  +12
                </div>
              </div>
              <p className="text-[#a78bfa] text-xs font-bold tracking-widest uppercase mb-0.5">
                Active Teams
              </p>
              <p className="text-white/40 text-xs leading-snug">
                Join teams to managing budgets.
              </p>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mt-6 sm:mt-8 gap-3 sm:gap-0">
          <button className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors" onClick={navigatetoDashboard}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-white/25 hover:text-white/50 text-xs tracking-widest uppercase transition-colors">
              Request New Code
            </button>
            <button className="text-white/25 hover:text-white/50 text-xs tracking-widest uppercase transition-colors">
              Help Center
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
