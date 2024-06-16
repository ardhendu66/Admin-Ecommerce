import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === "POST") {
            const { name, brand, image } = req.body
            let pro = await Upload.findOne({name})
            const result = (brand !== '') ? brand.charAt(0).toUpperCase() + brand.slice(1) : null

            if(pro) {
                for(const key in pro.brand) {
                    if(key === brand) {
                        return res.status(202).json({message: "Brand already exists"})
                    }
                }
                if(brand !== '') {
                    const obj = { [result]: [image] }
                    const newProduct = await Upload.findOneAndUpdate({name}, {
                        $set: {
                            brand: {...pro.brand, ...obj}
                        }
                    })
                    return res.status(201).json({
                        message: "Brand creation successfull", product: newProduct
                    })
                }
                else if(brand === '') {
                    return res.status(202).json({message: "Invalid brand name"})
                }
                return res.status(202).json({message: "Product Name conflicts"})
            }

            const product = await Upload.create({
                name,
                brand: {
                    [brand]: [image]
                }
            })
            return res.status(201).json({
                message: "Brand creation successfull", product: product
            })
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 