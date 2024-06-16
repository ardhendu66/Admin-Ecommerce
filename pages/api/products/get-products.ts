import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'GET') {
            const productList = await Product.find({})
            if(productList) {
                res.status(200).json(productList)
            }
            return res.status(404).json({message: "Product-list not found"})
        }
    }
    catch(err: any) {
        return res.status(500).json({message: "internal server error :("})
    }
} 