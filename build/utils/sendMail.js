"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const sendMail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const { email, subject, template, data } = options;
    // Get the path to the email template file
    const templatePath = path_1.default.join(__dirname, "../mails", template);
    // Logging the template path for debugging
    console.log("Template Path:", templatePath);
    // Render the email template with EJS
    try {
        const html = await ejs_1.default.renderFile(templatePath, data);
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Could not send email");
    }
};
exports.default = sendMail;
