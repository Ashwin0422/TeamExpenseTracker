import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";


const InputField = ({ label, name, type, placeholder, value, onChange, icon, maxLength }) => (
  <div>
    <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
    <div className="relative group">
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] group-hover:border-white/20 transition-all duration-200"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-zinc-600 group-focus-within:text-violet-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
    </div>
  </div>
);

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", emailId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = isLogin ? "/auth/login/" : "/auth/register/";
      const body = isLogin
        ? { email: formData.emailId, password: formData.password }
        : { name: formData.username, email: formData.emailId, password: formData.password };
      const response = await API.post(url, body);
      isLogin ? login(response.data) : signup(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/google/", {
        token: credentialResponse.credential,
      });
      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed.");
    setGoogleLoading(false);
  };

  const switchMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setFormData({ username: "", emailId: "", password: "" });
  };

  return (

      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] p-4 relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-violet-800/6 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/30 mb-4 hover:scale-110 hover:shadow-violet-600/50 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20M6 15h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Team Expense Tracker</h1>
            <p className="text-zinc-500 text-sm">Track, split, and control your team spending.</p>
          </div>

          {/* Card */}
          <div className="bg-[#16161a] border border-white/8 rounded-2xl shadow-2xl p-8 hover:border-violet-500/20 hover:shadow-violet-600/5 transition-all duration-500">

            {/* Toggle tabs */}
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 mb-7">
              {["Sign In", "Sign Up"].map((tab) => {
                const isActive = tab === "Sign In" ? isLogin : !isLogin;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={switchMode}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                        : "text-zinc-500 hover:text-zinc-300"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-zinc-500 text-sm">
                {isLogin ? "Sign in to your account to continue." : "Join us and start tracking today."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  maxLength={50}
                  icon={<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>}
                />
              )}

              <InputField
                label="Email Address"
                name="emailId"
                type="email"
                placeholder="Enter your email"
                value={formData.emailId}
                onChange={handleChange}
                maxLength={254}
                icon={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></>}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                maxLength={128}
                icon={<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>}
              />

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span className="text-red-400 text-xs font-medium">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {isLogin ? "Sign In" : "Sign Up"}
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-zinc-600 text-xs font-medium">or continue with</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Google Button */}
            <div className="relative w-full">
              {/* Hidden real Google button stretched over custom button */}
              <div className="absolute inset-0 z-10 overflow-hidden opacity-0 cursor-pointer">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="rectangular"
                  size="large"
                  text={isLogin ? "signin_with" : "signup_with"}
                  width="400"
                />
              </div>

              {/* Visible custom full-width button */}
              <button
                type="button"
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] rounded-xl text-sm text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLogin ? "Sign in with Google" : "Sign up with Google"}
                  </>
                )}
              </button>
            </div>

            {/* Footer toggle */}
            <div className="text-center mt-6 pt-6 border-t border-white/5">
              <p className="text-zinc-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                {" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-zinc-600 text-xs mt-6">
            By continuing, you agree to our{" "}
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Terms</span>
            {" "}and{" "}
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>

  );
};

export default LoginSignup;