import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";

const LoginPopup = () => {
  const { axios, setToken, setShowLogin } = useAppContext();
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!email || !password || (state !== "login" && !name)) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      if (state === "login") {
        const { data } = await axios.post("/api/auth/login", { email, password });
        if (data.success) {
          toast.success("Welcome back!");
          setToken(data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post("/api/auth/register", {
          username: name,
          email,
          password,
        });
        if (data.success) {
          toast.success("Account created successfully!");
          setToken(data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center bg-black/70 animate-fade-in font-outfit"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="sm:w-[400px] w-full text-center border border-slate-100 rounded-2xl p-8 bg-white shadow-2xl relative mx-4 max-md:mx-4"
      >
        {/* Close Button */}
        <img
          src={assets.closeIcon}
          alt="close-icon"
          className="absolute top-5 right-5 h-4 w-4 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
          onClick={() => setShowLogin(false)}
        />

        <h1 className="text-slate-800 text-3xl mt-6 font-medium tracking-tight">
          {state === "login" ? "Login" : "Sign Up"}
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          {state === "login"
            ? "Please sign in to access bookings & dashboard"
            : "Create an account to start booking"}
        </p>

        {/* Inputs */}
        <div className="mt-8 space-y-4">
          {state !== "login" && (
            <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-12 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-round"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="border-none outline-none ring-0 w-full text-slate-800 placeholder-slate-400 bg-transparent pr-4 text-sm"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-12 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="border-none outline-none ring-0 w-full text-slate-800 placeholder-slate-400 bg-transparent pr-4 text-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-12 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-lock"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-none outline-none ring-0 w-full text-slate-800 placeholder-slate-400 bg-transparent pr-4 text-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {state === "login" && (
          <div className="mt-3 text-left pl-3 text-primary font-medium hover:underline transition-all">
            <button className="text-xs cursor-pointer" type="button">
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-12 rounded-full text-white bg-primary hover:bg-blue-700 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-medium disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : state === "login" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </button>

        <p
          onClick={() => setState((prev) => (prev === "login" ? "register" : "login"))}
          className="text-slate-400 text-sm mt-5 mb-6 cursor-pointer font-medium select-none hover:text-slate-600 transition-colors"
        >
          {state === "login" ? "Don't have an account? " : "Already have an account? "}
          <span className="text-primary hover:underline font-semibold">
            {state === "login" ? "Register here" : "Login here"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
