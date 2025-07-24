import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import UserModel from "@/lib/Admin";
import { envVariables } from "@/config/config";

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
    if(request.method === "POST") {
        try {
            const { email, token } = request.body;
            if(!token || !email) {
                return res.status(200).json({message: "Invalid Token or Email-id"});
            }
    
            const user = await UserModel.findOne({email, verifyToken: token});
            if(!user) {
                return res.status(200).json({
                    message: "User regarding this Email-id not found",
                    success: false,
                })
            }
            else if(user.emailVerified) {
                return res.status(200).json({
                    message: "Email has already been verified",
                    success: false,
                })
            }
            
            const decodedToken: any = jwt.verify(token, envVariables.jwtSecretKey);
            const tokenExpiryDate = new Date(decodedToken.expiryDate);
            if(tokenExpiryDate > new Date()) {
                const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
                    emailVerified: true
                });
                if(updatedUser) {
                    return res.status(200).json({
                        message: "Email-id has been verified",
                        success: true,
                    });
                }
                return res.status(200).json({
                    message: "User not found",
                    success: false,
                });
            }
            
            return res.status(202).json({
                message: "Token has been expired. Do Sign-up again.",
                success: false,
                expires: true,
            })
        }
        catch(err: any) {
            return res.status(200).json({message: err.message})
        }
    }
}