import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/utils/mailer";
import bcrypt from 'bcryptjs'
import { envVariables } from "@/config/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        try {
            const hashedString = await bcrypt.hash(new Date().toISOString(), 10)
            const response = await sendEmail(hashedString, envVariables.mailSendToEmail);
            if(response.accepted) {
                return res.status(200).json({
                    message: 'Email has been sent successfully 😊'
                })
            }
            else if(response.rejected) {
                return res.status(400).json({ 
                    message: "Email sent failed 😕"
                })
            }
    
            return res.status(400).json({
                message: "Error occurred during transmission of mail 😕"
            })
        }
        catch(err: any) {
            return res.status(500).json({message: err.message})
        }
    }
}