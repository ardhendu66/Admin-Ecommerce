import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'GET' && req.query.id) {
            const product = await Product.findById(req.query.id).populate('category')
            if(product) {
                return res.status(200).json(product)
            }
            return res.status(403).json({message: "Failed to fetch Product"})
        }
    }
    catch(err: any) {
        return res.status(500).json({message: "internal server error :("})
    }
} 