import nodemailer from 'nodemailer';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const sendWelcomeEmail = async ({ to, subject, html, attachments = [] }, next) => {
    try {
        if (!process.env.SMTP_SERVICE) {
            throw new ErrorHandler('SMTP Service not found', 404);
        }

        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.STORFLEET_SMTP_MAIL,
                pass: process.env.STORFLEET_SMTP_MAIL_PASSWORD,
            },
        });

        const emailData = {
            from: process.env.STORFLEET_SMTP_MAIL,
            to,
            subject,
            html,
            attachments,
        };

        const sentEmail = await transporter.sendMail(emailData);
        if (!sentEmail) {
            throw new ErrorHandler('Email not sent', 400);
        }

        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        next(error);
    }
};

export default sendWelcomeEmail;
