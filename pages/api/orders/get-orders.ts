import { NextApiRequest, NextApiResponse } from "next";
import Order from "@/lib/Order";
import { ConnectionWithMongoose } from '@/lib/mongoose';

ConnectionWithMongoose().then(res => {});

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
    try {
        const orders = await Order.find({}).sort({createdAt: -1});       
        if(!orders) {
            return res.status(202).json({message: "Orders not found"});
        }
        return res.status(200).json(orders);
    }
    catch(err: any) {
        return res.status(200).json({message: err.message});
    }
}