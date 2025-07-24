import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    if(req.method === 'GET') {
        try {
            const { adminId } = req.query;

            const productList = await Product.find({adminId}, null, { sort: { createdAt: -1 }});

            if(productList) {
                return res.status(200).json(productList);
            }

            return res.status(404).json({message: "Products not found"})
        }
        catch(err: any) {
            return res.status(500).json({message: "something went wrong. error code 500."})
        }
    }

    return res.status(405).json({message: "Method not allowed"});
} 