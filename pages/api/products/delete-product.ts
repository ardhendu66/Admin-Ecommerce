import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'DELETE' && req.query?.id) {
            
            const product = await Product.findByIdAndDelete(req.query.id)
            
            return (
                product 
                    ?
                res.status(202).json({message: "has been deleted successfully 😊"})
                    :
                res.status(203).json({message: "Product deletion failed 😣"})
            )
        }
    }
    catch(err: any) {
        return res.status(500).json({message: "deletion failed. error code 500"});
    }
} 