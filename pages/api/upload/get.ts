import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'GET' && req.query.name) {
            if(req.query.brand) {
                const { name, brand } = req.query
                const product = await Upload.findOne({name})

                let ArrayOfSelectedBrand = []
                for(const key in product.brand) {
                    if(key === brand) {
                        ArrayOfSelectedBrand = product.brand[key]
                    }
                }

                return ArrayOfSelectedBrand.length > 0 && brand !== ''
                ? 
                res.status(200).json({
                    [String(brand)]: ArrayOfSelectedBrand
                })
                : 
                res.status(403).json({message: 'Failed to fetch products 😣'})
            }
            else {
                const { name } = req.query
                const product = await Upload.findOne({name})

                return product 
                ? 
                res.status(200).json(product.brand)
                : 
                res.status(403).json({ message: 'Failed to fetch products 😣'})
            }
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
}