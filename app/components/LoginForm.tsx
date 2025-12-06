"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setLoggedIn, setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (res.status === 200) {
        setMessage(data.message);
        const meRes = await fetch("/api/me", { credentials: "include" });
        const meData = await meRes.json();
        setLoggedIn(meData.loggedIn);
        setUser(meData.user);
        router.push("/");
      } else {
        setMessage(data.error);
      }
    } catch {
      setLoading(false);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm bg-slate-900 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {message && (
            <div
              className={`text-center px-4 py-2 rounded my-2 ${
                message === "Login successful"
                  ? "text-green-700 bg-green-100 border border-green-400"
                  : "text-red-700 bg-red-100 border border-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="email" className="text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 transition font-medium flex justify-center"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Logging in</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex justify-between text-sm mt-4 text-slate-300">
          <Link href="/register" className="hover:text-white transition">
            Register
          </Link>
          <Link href="/forgot-password" className="hover:text-white transition">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
