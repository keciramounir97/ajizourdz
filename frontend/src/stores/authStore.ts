import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSeedAccounts } from "../data/seedAccounts";
import { Account } from "../types/domain";

const accounts = getSeedAccounts();
const defaultUser =
  accounts.find((account) => account.role === "user") ?? accounts[0];

export type AuthStore = {
  user: Account | null;
  accounts: Account[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (account: Omit<Account, "id" | "role" | "providerType"> & Partial<Pick<Account, "role" | "providerType">>) => void;
  quickLogin: (accountId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accounts,
      isAuthenticated: false,
      login: (email, password) => {
        const user = get().accounts.find(
          (account) => account.email === email && account.password === password,
        );
        if (!user) return false;
        set({ user, isAuthenticated: true });
        return true;
      },
      register: (account) => {
        const user: Account = {
          id: `user-${Date.now()}`,
          role: account.role ?? "user",
          providerType: account.providerType ?? "Traveler",
          ...account,
        };
        set((state) => ({
          accounts: [user, ...state.accounts],
          user,
          isAuthenticated: true,
        }));
      },
      quickLogin: (accountId) =>
        set((state) => ({
          user:
            state.accounts.find((account) => account.id === accountId) ??
            state.user,
          isAuthenticated: true,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "ajizor-auth-store",
      partialize: (state) => ({
        user: state.user,
        accounts: state.accounts,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AuthStore>),
        accounts: mergeAccounts(accounts, (persisted as Partial<AuthStore>)?.accounts),
      }),
    },
  ),
);

function mergeAccounts(seed: Account[], persisted?: Account[]) {
  const byId = new Map<string, Account>();
  [...seed, ...(persisted ?? [])].forEach((account) => {
    byId.set(account.id, account);
  });
  return Array.from(byId.values());
}
