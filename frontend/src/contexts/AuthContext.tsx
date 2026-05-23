import { createContext, ReactNode, useContext } from "react";
import { AuthStore, useAuthStore } from "../stores/authStore";

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthStore();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext missing");
  return context;
}
