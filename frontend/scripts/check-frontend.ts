import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), "../.env");
const env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const apiUrl = env.match(/^VITE_API_URL=(.+)$/m)?.[1] ?? "http://127.0.0.1:5000/api";
const routeFile = readFileSync(resolve(process.cwd(), "src/routes/AppRoutes.tsx"), "utf8");
const routes = Array.from(routeFile.matchAll(/path="([^"]+)"/g)).map((match) => match[1]);
const protectedRoutes = [
  "/reservations",
  "/activity-context",
  "/smart-plan",
  "/profile",
  "/dashboard",
  "/my-trips",
  "/reviews",
  "/support",
  "/settings",
  "/admin",
  "/admin/providers",
  "/admin/offers",
  "/admin/bookings",
  "/admin/currencies",
  "/admin/users",
  "/admin/sections",
  "/admin/contacts",
  "/admin/audit",
  "/super-admin",
];

console.log("AJIZOUR FRONTEND CHECK");
console.log("App: Ajizour Tourism Frontend v1.0.0");
console.log(`Vite mode: ${process.env.NODE_ENV ?? "development"}`);
console.log(`API base URL: ${apiUrl}`);
console.log("Enabled locales: FR, EN, AR");
console.log("Enabled currencies: API/defaults DZD, EUR, USD plus admin custom currencies");
console.log(`Service worker: ${existsSync(resolve(process.cwd(), "public/service-worker.js")) ? "configured" : "missing"}`);
console.log(`Route manifest: ${routes.join(", ")}`);
console.log(`Protected routes: ${protectedRoutes.join(", ")}`);

const typecheck = spawnSync("npx tsc -b", { shell: true, cwd: process.cwd(), stdio: "inherit" });
if (typecheck.error) console.error(typecheck.error.message);
if (typecheck.status !== 0) {
  console.error("AJIZOUR FRONTEND CHECK FAILED: typecheck failed.");
  process.exit(typecheck.status ?? 1);
}

console.log("Typecheck: passed");
console.log("AJIZOUR FRONTEND CHECK PASSED");
