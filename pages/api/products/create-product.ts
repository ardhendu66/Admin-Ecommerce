import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'POST') {
            const { 
                name, description, price, images, amount, category, categoryProperties, discount, sellerName
            } = req.body
            
            let pro;
            if(category !== '') {
                if(Object.keys(categoryProperties).length > 0) {
                    pro = await Product.create({
                        name, images: Array.from(new Set([...images])), 
                        description, price, amount, category, categoryProperties,
                        discountPercentage: discount, seller: sellerName
                    })
                }
                else {
                    pro = await Product.create({
                        name, images: Array.from(new Set([...images])), 
                        description, price, amount, category, seller: sellerName, discountPercentage: discount
                    })
                }
            }
            else {
                pro = await Product.create({
                    name, images: Array.from(new Set([...images])), 
                    description, price, amount, discountPercentage: discount, seller: sellerName
                })
            }
            const product = await pro.save()        

            return (
                product 
                    ?
                res.status(201).json({message: "Product has been created successfully 😊"})            
                    :
                res.status(205).json({message: "something went wrong! 😕"})
            )
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 