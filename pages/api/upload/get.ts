import { NextApiRequest, NextApiResponse } from "next";
import Upload from "@/lib/Upload";
import { ConnectionWithMongoose } from "@/lib/mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();

    if(req.method === 'GET') {

        try {
            if(req.query.brand) {
                
                const { name, brand } = req.query;

                const data = await Upload.findOne({name}, {
                    _id: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    brand: {
                        $elemMatch: {
                            name: brand
                        }
                    }
                })

                if(data) {
                    return res.status(200).json(data);
                }

                return res.status(404).json({message: "Item not found. error code 404."});
            }
            else {
                const { name }= req.query;

                const data = await Upload.findOne({name});

                if(data) {
                    return res.status(200).json(data);
                }

                return res.status(404).json({message: "Item not found. error code 404."});
            }
        }
        catch(err) {
            console.error(err);            
            return res.status(500).json({message: "Item found error, error code 500."});
        }
    }

    return res.status(405).json({message: "Method not allowed!"});
}