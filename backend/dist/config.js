import "dotenv/config";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";
const rootEnv = resolve(process.cwd(), "../.env");
if (existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv, override: true });
}
export const config = {
    appName: "Ajizour Tourism API",
    version: "1.0.0",
    nodeEnv: process.env.NODE_ENV ?? "development",
    host: process.env.HOST ?? "0.0.0.0",
    port: Number(process.env.PORT ?? 5000),
    jwtSecret: process.env.JWT_SECRET ?? "dev-only-change-me",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
    database: {
        host: process.env.DB_HOST ?? "127.0.0.1",
        port: Number(process.env.DB_PORT ?? 3306),
        name: process.env.DB_NAME ?? "ajizour",
        user: process.env.DB_USER ?? "root",
        password: process.env.DB_PASSWORD ?? "",
        poolMin: Number(process.env.DB_POOL_MIN ?? 0),
        poolMax: Number(process.env.DB_POOL_MAX ?? 10),
    },
    smtp: {
        host: process.env.SMTP_HOST ?? "",
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: String(process.env.SMTP_SECURE ?? "true") === "true",
        user: process.env.SMTP_USER ?? "",
        password: process.env.SMTP_PASSWORD ?? "",
        from: process.env.EMAIL_FROM ?? "",
        fromName: process.env.EMAIL_FROM_NAME ?? "Ajizour Platform",
    },
    ai: {
        nvidiaKey: process.env.NVIDIA_API_KEY ?? "",
        nvidiaBaseUrl: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
        nvidiaModel: process.env.NVIDIA_MODEL ?? "meta/llama-3.1-8b-instruct",
        fallbackKey: process.env.OPENAI_API_KEY ?? "",
        fallbackBaseUrl: process.env.OPENAI_BASE_URL ?? "",
        fallbackModel: process.env.OPENAI_MODEL ?? "",
    },
};
export function configured(value) {
    return value.trim().length > 0;
}
