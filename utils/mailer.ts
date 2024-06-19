import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import jwt from 'jsonwebtoken';
import { envVariables } from '@/config/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: envVariables.productionEmail,
        pass: envVariables.productionPassSecret,
    }
})

export const sendEmail = async (token: string, email: string) => {
    const response = await transporter.sendMail({
        from: envVariables.productionEmail,
        to: email,
        subject: 'Verification using Token',
        text: 'Click this token to verify your account and access your protected account',
        html: `<div>Click this token <b style="text-decoration: underline;"><a href="${envVariables.domainName}/auth/verify-token?token=${token}&email=${email}" style="text-decoration: underline;">${token}</a></b> to verify your account and access your protected account</div>`,
    })

    return response as SMTPTransport.SentMessageInfo;
}
