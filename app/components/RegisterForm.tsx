"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  let messageElement = null;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    regNumber: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const [response, setResponse] = useState({
    message: "",
    status: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    setLoading(false);
    setResponse({ message: data.error || data.message, status: res.status });
  };

  useEffect(() => {
    if (response.message && response.status === 201) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [response]);

  if (response.message) {
    if (response.status === 400) {
      messageElement = (
        <div className="text-center text-red-700 bg-red-100 border border-red-400 px-4 py-2 rounded-md my-2">
          {response.message}
        </div>
      );
    } else {
      messageElement = (
        <div className="text-center text-green-700 bg-green-100 border border-green-400 px-4 py-2 rounded-md my-2">
          {response.message}
        </div>
      );
    }
  }
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm bg-slate-900 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Register
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {messageElement}
          <div className="flex flex-col">
            <label htmlFor="fName" className="text-slate-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="fName"
              value={form.fName}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lName" className="text-slate-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lName"
              value={form.lName}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="regNumber" className="text-slate-300 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              name="regNumber"
              value={form.regNumber}
              onChange={handleChange}
              pattern="[A-Z]{2}[0-9]{8}"
              title="Format: 2 uppercase letters followed by 8 digits (e.g., IT24100028)"
              className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
              required
            />
          </div>
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
              required
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
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confPassword" className="text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confPassword"
              value={form.confPassword}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
              required
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
                <span>Registering</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="flex justify-center text-center text-sm mt-4 text-slate-300">
          <Link href="/login" className="hover:text-white transition">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
