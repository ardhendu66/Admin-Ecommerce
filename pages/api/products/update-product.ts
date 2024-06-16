import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'PUT') {
            const {
                id, name, imageArray, description, price, amount, category, categoryProperties 
            } = req.body

            const pro = await Product.findById(id)
            let product;
            if(category !== '') {
                if(Object.keys(categoryProperties).length > 0) {
                    product = await Product.findByIdAndUpdate(id, {
                        name, description, price, amount, category, 
                        images: Array.from(new Set([...imageArray, ...pro.images])), categoryProperties
                    })
                }
                else {
                    product = await Product.findByIdAndUpdate(id, {
                        name, description, price, amount, category, 
                        images: Array.from(new Set([...imageArray, ...pro.images])),
                    })
                }
            }
            else {
                product = await Product.findByIdAndUpdate(id, {
                    name, description, price, amount, 
                    images: Array.from(new Set([...imageArray, ...pro.images])),
                })
            }
            await product.save()

            return (
                product 
                    ?
                res.status(202).json({message: "Product updated successfully"})
                    :
                res.status(411).json({message: "Product updation failed"})
            )
        }
    }
    catch(err: any) {
        return res.status(500).json({message: "internal server error :("})
    }
} 