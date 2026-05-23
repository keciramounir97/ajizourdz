import { Account, Role } from "../types/domain";

const fallbackAccounts: Account[] = [
  {
    id: "super-1",
    name: "Nadia Platform",
    email: "super@ajizor.dz",
    password: "super123",
    role: "super_admin",
    providerType: "Platform",
  },
  {
    id: "admin-hotel-1",
    name: "Samir Provider",
    email: "hotel@ajizor.dz",
    password: "admin123",
    role: "admin",
    providerType: "Hotel",
  },
  {
    id: "client-1",
    name: "Amira Benali",
    email: "client@ajizor.dz",
    password: "client123",
    role: "user",
    providerType: "Traveler",
  },
];

function readAccount(index: number): Account | null {
  const env = import.meta.env;
  const id = env[`VITE_SEED_ACCOUNT_${index}_ID`];
  const name = env[`VITE_SEED_ACCOUNT_${index}_NAME`];
  const email = env[`VITE_SEED_ACCOUNT_${index}_EMAIL`];
  const password = env[`VITE_SEED_ACCOUNT_${index}_PASSWORD`];
  const role = env[`VITE_SEED_ACCOUNT_${index}_ROLE`] as Role | undefined;
  const providerType = env[`VITE_SEED_ACCOUNT_${index}_PROVIDER_TYPE`];

  if (!id || !name || !email || !password || !role || !providerType) {
    return null;
  }

  return { id, name, email, password, role, providerType };
}

export function getSeedAccounts() {
  const accounts = Array.from({ length: 24 }, (_, index) =>
    readAccount(index + 1),
  ).filter(Boolean) as Account[];

  return accounts.length ? accounts : fallbackAccounts;
}
