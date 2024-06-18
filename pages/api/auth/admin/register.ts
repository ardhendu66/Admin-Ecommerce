import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs'
import { ConnectionWithMongoose } from "@/lib/mongoose";
import UserModel from "@/lib/User";
import { sendEmail } from "@/utils/mailer";

ConnectionWithMongoose();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        try {
            const { name, username, email, password } = req.body;

            const existingUserByVerifiedEmail = await UserModel.findOne({
                email, emailVerified: true
            })
            if(existingUserByVerifiedEmail) {
                return res.status(200).json({message: "Email already exists"})
            }
            const existingUserByUsername = await UserModel.findOne({username})
            if(existingUserByUsername) {
                return res.status(200).json({message: "Username already taken"})
            }

            const user = await UserModel.findOne({email});
            const verifyCode = `${Math.floor(Math.random()*100000 + 100000)}`
            if(user) {
                if(user.emailVerified) {
                    return res.status(200).json({message: "User already exists with the email"})
                }
                else {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(password, salt)
                    const hashedVerifyCode = await bcrypt.hash(verifyCode, salt)
                    const expiryDate = new Date(new Date().setHours(new Date().getHours() + 1))
                    await UserModel.findByIdAndUpdate(user._id, {
                        password: hashedPassword, 
                        verifyToken: hashedVerifyCode,
                        verifyTokenExpiry: expiryDate,
                    })
                    const response = await sendEmail(hashedVerifyCode, email);
                    if(response.accepted) {
                        return res.status(202).json({
                            message: "Check your mail and do verify"
                        })
                    }
                    else if(response.rejected) {
                        return res.status(200).json({
                            message: "Email Verification Process failed. Do signup again"
                        })
                    }
                }
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const hashedVerifyCode = await bcrypt.hash(verifyCode, salt)
            const expiryDate = new Date(new Date().setHours(new Date().getHours() + 1))
            const registeredUser = await UserModel.create({
                name, username, email, 
                password: hashedPassword, 
                verifyToken: hashedVerifyCode, 
                verifyTokenExpiry: expiryDate,
            })
            const response = await sendEmail(hashedVerifyCode, email);
            if(response.accepted) {
                return res.status(202).json({
                    message: "An Email has been sent to this email id regarding on   verification"
                })
            }
            else if(response.rejected) {
                return res.status(200).json({
                    message: "Email Verification Process failed. Do signup again"
                })
            }

            return res.status(201).json({
                registeredUser,
                message: "User registered. Do email-verification to access your account", 
            })
        }
        catch(err: any) {
            return res.status(500).json({errorMessage: err.message})
        }
    }
}