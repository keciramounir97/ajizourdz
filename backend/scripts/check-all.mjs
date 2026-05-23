import { spawnSync } from "node:child_process";

function run(label, args) {
  console.log(`\n===== ${label} =====`);
  const command = ["npm", ...args].join(" ");
  const result = spawnSync(command, { shell: true, stdio: "inherit" });
  if (result.error) console.error(result.error.message);
  return result.status === 0;
}

const backendOk = run("AJIZOUR BACKEND CHECK", ["--prefix", "backend", "run", "check"]);
const frontendOk = run("AJIZOUR FRONTEND CHECK", ["--prefix", "frontend", "run", "check"]);

if (backendOk && frontendOk) {
  console.log("\nAJIZOUR CHECK PASSED: frontend and backend are ready");
  process.exit(0);
}

console.error("\nAJIZOUR CHECK FAILED");
if (!backendOk) console.error("- Backend readiness check failed.");
if (!frontendOk) console.error("- Frontend readiness check failed.");
process.exit(1);
