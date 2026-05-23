import nodemailer from "nodemailer";
import { config, configured } from "./config.js";
import { withTimeout } from "./db.js";
export function makeTransporter() {
    if (!configured(config.smtp.host) || !configured(config.smtp.user))
        return null;
    return nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.password,
        },
    });
}
export async function checkEmail() {
    const transporter = makeTransporter();
    if (!transporter)
        return { ok: false, message: "SMTP not configured" };
    try {
        await withTimeout(transporter.verify(), 7000);
        return { ok: true, message: "verified" };
    }
    catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "SMTP verification failed" };
    }
}
export async function sendEmail(to, subject, text) {
    const transporter = makeTransporter();
    if (!transporter)
        return { ok: false, message: "SMTP not configured" };
    try {
        await transporter.sendMail({
            to,
            subject,
            text,
            from: `"${config.smtp.fromName}" <${config.smtp.from}>`,
        });
        return { ok: true, message: "sent" };
    }
    catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "email send failed" };
    }
}
