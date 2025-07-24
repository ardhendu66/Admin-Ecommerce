import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();

    if(req.method !== 'PUT') {
        return res.status(405).json("Method not allowed");
    }

    try {
        const { name, image, brand } = req.body;
        let product = await Upload.findOne({name})
        
        if(product) {
            const updatedProduct = await Upload.findOneAndUpdate({name, "brand.name": brand}, {
                $push: {
                    "brand.$.images": image
                }
            })
            if(updatedProduct) {
                return res.status(202).json({
                    message: "Image updated successfully 🙂"
                })
            }
        }
    
        return res.status(403).json({message: "Image updation failed 😥"})
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 