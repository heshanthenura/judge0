"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedIn, setLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      setLoggedIn(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="w-full bg-slate-900 px-6 py-3 shadow">
      <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          <Link href="/" className="hover:opacity-80 transition">
            Judge0
          </Link>
        </h1>

        <div className="hidden md:flex gap-6 text-slate-300">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          {loggedIn && (
            <Link
              href="/profile"
              className="hover:text-white transition text-center"
            >
              Profile
            </Link>
          )}
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
        </div>

        <div className="hidden md:flex gap-4">
          {!loggedIn && (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
              >
                Register
              </Link>
            </>
          )}
          {loggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 transition font-medium"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 text-slate-300 items-center">
          <Link href="/" className="hover:text-white transition text-center">
            Home
          </Link>
          {loggedIn && (
            <Link
              href="/profile"
              className="hover:text-white transition text-center"
            >
              Profile
            </Link>
          )}
          <Link
            href="/about"
            className="hover:text-white transition text-center"
          >
            About
          </Link>

          {!loggedIn && (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded bg-sky-600 text-white hover:bg-sky-700 transition font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
              >
                Register
              </Link>
            </>
          )}

          {loggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 transition font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
