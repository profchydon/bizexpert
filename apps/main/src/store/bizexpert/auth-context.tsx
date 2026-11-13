"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { bizexpertApi } from "@/lib/bizexpert/api";
import {
  getToken,
  setToken,
  setUser,
  getUser,
  setBusiness,
  getBusiness,
  clearAuth,
} from "@/lib/bizexpert/auth";
import type { Business, User } from "@/types/bizexpert";
import routes from "@/routes";

interface AuthContextType {
  user: User | null;
  business: Business | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setBusiness: (b: Business) => void;
  updateUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function BizExpertAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(null);
  const [business, setBusinessState] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      setUserState(getUser());
      setBusinessState(getBusiness());
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await bizexpertApi.post("/auth/login", { email, password });
      const { user: u, token, businesses } = res.data;
      setToken(token);
      setUser(u);
      setUserState(u);
      if (businesses?.[0]) {
        setBusiness(businesses[0]);
        setBusinessState(businesses[0]);
        router.push(routes.OVERVIEW);
      } else {
        router.push("/onboarding/business");
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    setBusinessState(null);
    router.push(routes.LOGIN);
  }, [router]);

  const setBusinessCtx = useCallback((b: Business) => {
    setBusiness(b);
    setBusinessState(b);
  }, []);

  const updateUser = useCallback((u: User) => {
    setUser(u);
    setUserState(u);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        isLoading,
        login,
        logout,
        setBusiness: setBusinessCtx,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useBizExpertAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useBizExpertAuth must be used within BizExpertAuthProvider",
    );
  }
  return ctx;
}
