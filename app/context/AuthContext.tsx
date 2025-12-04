"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type User = {
  id: string;
  email: string;
  fName?: string;
  lName?: string;
};

type AuthContextType = {
  loggedIn: boolean;
  user: User | null;
  setLoggedIn: (val: boolean) => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();

        setLoggedIn(data.loggedIn);
        setUser(data.user || null);
        console.log("Auth fetched:", data.user);
      } catch {
        setLoggedIn(false);
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    checkLogin();
  }, []);

  const value = useMemo(
    () => ({ loggedIn, setLoggedIn, user, setUser }),
    [loggedIn, user]
  );

  if (!initialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
