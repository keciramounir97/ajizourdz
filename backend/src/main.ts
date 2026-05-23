import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { config } from "./config.js";
import { AppService } from "./app.service.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ["log", "error", "warn"] });
  app.enableCors();

  const service = app.get(AppService);
  const readiness = await service.readinessLog();

  await app.listen(config.port, config.host);

  const db = readiness.health.database;
  const email = readiness.health.email;
  console.log("\nAJIZOUR BACKEND STARTUP");
  console.log(`App: ${config.appName} v${config.version}`);
  console.log(`Server: NODE_ENV=${config.nodeEnv} HOST=${config.host} PORT=${config.port}`);
  console.log(`MySQL: ${db.host}:${db.port}/${db.name} user=${db.user} pool=${db.pool.min}-${db.pool.max} status=${db.ok ? "connected" : "failed"} (${db.message})`);
  console.log(`Migration: ${readiness.migration.ok ? "ready" : "failed"} (${readiness.migration.message})`);
  console.log(`Seed: ${readiness.seed.ok ? "ready" : "fallback"} (${readiness.seed.message})`);
  console.log(`JWT: configured=${config.jwtSecret.length > 20} access=${config.jwtExpiresIn} refresh=${config.jwtRefreshExpiresIn}`);
  console.log(`SMTP: ${email.host}:${email.port} secure=${email.secure} user=${email.user} status=${email.ok ? "verified" : "failed"} (${email.message})`);
  console.log(`AI: NVIDIA=${readiness.health.ai.nvidia ? "configured" : "missing"} fallback=${readiness.health.ai.fallback ? "configured" : "missing"}`);
  console.log(`Modules: ${readiness.health.modules.join(", ")}`);
  console.log(`Health: http://${config.host === "0.0.0.0" ? "127.0.0.1" : config.host}:${config.port}/api/health\n`);
}

bootstrap().catch((error) => {
  console.error("AJIZOUR BACKEND FAILED TO START");
  console.error(error);
  process.exit(1);
});
