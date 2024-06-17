import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'GET') {
            const productList = await Product.find({}, null, { sort: { createdAt: -1 }})
            if(productList) {
                return res.status(200).json(productList)
            }
            return res.status(204).json({message: "Products not found"})
        }
    }
    catch(err: any) {
        return res.status(200).json({message: "internal server error :("})
    }
} 