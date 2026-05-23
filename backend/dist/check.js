import "reflect-metadata";
import { AppService } from "./app.service.js";
import { config } from "./config.js";
import { destroyDb } from "./db.js";
const service = new AppService();
const readiness = await service.readinessLog();
const health = readiness.health;
console.log("AJIZOUR BACKEND CHECK");
console.log(`App: ${health.app} v${health.version}`);
console.log(`Server: NODE_ENV=${config.nodeEnv} HOST=${config.host} PORT=${config.port}`);
console.log(`MySQL: ${health.database.host}:${health.database.port}/${health.database.name} user=${health.database.user} pool=${health.database.pool.min}-${health.database.pool.max} status=${health.database.ok ? "connected" : "failed"} (${health.database.message})`);
console.log(`Migration: ${readiness.migration.ok ? "ready" : "failed"} (${readiness.migration.message})`);
console.log(`Seed: ${readiness.seed.ok ? "ready" : "fallback"} (${readiness.seed.message})`);
console.log(`JWT: configured=${config.jwtSecret.length > 20} access=${config.jwtExpiresIn} refresh=${config.jwtRefreshExpiresIn}`);
console.log(`SMTP: ${health.email.host}:${health.email.port} secure=${health.email.secure} user=${health.email.user} status=${health.email.ok ? "verified" : "failed"} (${health.email.message})`);
console.log(`AI: NVIDIA=${health.ai.nvidia ? "configured" : "missing"} fallback=${health.ai.fallback ? "configured" : "missing"}`);
console.log(`Modules: ${health.modules.join(", ")}`);
console.log(`Health URL: http://${config.host === "0.0.0.0" ? "127.0.0.1" : config.host}:${config.port}/api/health`);
await destroyDb();
if (!config.jwtSecret || config.jwtSecret === "dev-only-change-me") {
    console.error("AJIZOUR BACKEND CHECK FAILED: JWT_SECRET is missing.");
    process.exit(1);
}
console.log("AJIZOUR BACKEND CHECK PASSED");
