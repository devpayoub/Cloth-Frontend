"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loginCustomer,
  registerCustomer,
  getCustomer,
  type MedusaCustomer,
} from "@/api/auth";

const TOKEN_KEY = "cloth-auth-token";

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authenticated"; customer: MedusaCustomer; token: string };

type AuthContextValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
  /** Reload customer data from the server (call after profile updates). */
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  /** Restore session from localStorage on mount. */
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      setState({ status: "guest" });
      return;
    }
    getCustomer(token)
      .then((customer) => setState({ status: "authenticated", customer, token }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ status: "guest" });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await loginCustomer(email, password);
    const customer = await getCustomer(token);
    localStorage.setItem(TOKEN_KEY, token);
    setState({ status: "authenticated", customer, token });
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      const token = await registerCustomer(email, password, firstName, lastName);
      const customer = await getCustomer(token);
      localStorage.setItem(TOKEN_KEY, token);
      setState({ status: "authenticated", customer, token });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ status: "guest" });
  }, []);

  const refresh = useCallback(async () => {
    if (state.status !== "authenticated") return;
    const customer = await getCustomer(state.token);
    setState((prev) =>
      prev.status === "authenticated" ? { ...prev, customer } : prev
    );
  }, [state]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, login, register, logout, refresh }),
    [state, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
