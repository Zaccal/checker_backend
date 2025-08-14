import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL ?? '',
        pass: process.env.EMAIL_PASSWORD ?? '',
    },
});
