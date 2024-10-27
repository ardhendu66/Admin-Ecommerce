import { NextApiRequest, NextApiResponse } from "next";
import Product from "@/lib/Product";
import { ConnectionWithMongoose } from "@/lib/mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    if(req.method === 'GET') {
        try {
            const { id, adminId } = req.query;

            const product = await Product.findOne({_id: id, adminId}).populate('category');

            if(product) {
                return res.status(200).json(product);
            }

            return res.status(404).json({message: "Product not found"});
        }
        catch(err: any) {
            return res.status(500).json({message: "something went wrong. error code 500."})
        }
    }

    return res.status(405).json({message: "Method not allowed"});
} 