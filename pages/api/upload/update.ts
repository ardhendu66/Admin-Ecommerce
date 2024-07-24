import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'PUT') {
            const { name, image, brand } = req.body;
            let product = await Upload.findOne({name})
            
            if(product) {
                const updatedProduct = await Upload.findOneAndUpdate({name}, {
                    $push: {
                        [`brand.${brand}`]: image
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
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 