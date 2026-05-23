import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CurrencyProvider } from "./CurrencyContext";
import { LocaleProvider } from "./LocaleContext";
import { ThemeProvider } from "./ThemeContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <CurrencyProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </CurrencyProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
