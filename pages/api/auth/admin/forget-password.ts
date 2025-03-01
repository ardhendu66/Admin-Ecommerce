import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import UserModel from "@/lib/Admin";
import { ConnectionWithMongoose } from "@/lib/mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    if(req.method === "POST") {
        try {
            const { username, newPassword } = req.query;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword as string, salt);
            const user = await UserModel.findOneAndUpdate({username}, {
                $set: {
                    password: hashedPassword
                }
            });
            if(!user) {
                return res.status(404).json({message: "User not found"});
            }

            return res.status(202).json({message: "Password updated successfully"});
        }
        catch(err: any) {
            return res.status(500).json({message: "Forgot Password Token not worked somehow."});
        }
    }

    return res.status(405).json({message: "Method not allowed"});
}