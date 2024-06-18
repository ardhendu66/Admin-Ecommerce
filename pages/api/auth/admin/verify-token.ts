import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@/lib/User";

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
                message: "Email-id verification failed",
                success: false,
            });
        }
        catch(err: any) {
            return res.status(200).json({message: err.message})
        }
    }
}