import { NextApiRequest, NextApiResponse } from "next";
import CategoryModel from "@/lib/Category";
import { ConnectionWithMongoose } from "@/lib/mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    
    if(req.method === 'DELETE') {
        try {
            const { id, sname } = req.query;
            const category = await CategoryModel.findByIdAndUpdate(id, {
                $pull: {
                    subCategory: {
                        name: sname
                    }
                }
            })
            if(category) {
                return res.status(202).json({message: "deleted successfully"});
            }
            return res.status(200).json({message: "not deleted"});
        }
        catch(err: any) {
            console.error(err.message)
            return res.status(500).json({message: err.message})        
        }
    }

    return res.status(405).json({message: "Method not allowed"})
}