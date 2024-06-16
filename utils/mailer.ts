import nodemailer from 'nodemailer'
import { envVariables } from '@/config/config'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

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
        html: `<div>Click <span><a href="https://admin-ecommerce-panel.vercel.app/auth/verify-token?email=${email}&token=${token}" style="text-decoration: underline;">${token}</a></span> to verify your account and access your protected account</div>`,
    })

    return response as SMTPTransport.SentMessageInfo;
}
