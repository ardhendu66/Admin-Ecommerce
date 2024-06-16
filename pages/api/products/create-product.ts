import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'POST') {
            const { 
                name, description, price, images, amount, category, categoryProperties 
            } = req.body
            console.log(req.body) 
            
            let pro;
            if(category !== '') {
                if(Object.keys(categoryProperties).length > 0) {
                    pro = await Product.create({
                        name, images: Array.from(new Set([...images])), 
                        description, price, amount, category, categoryProperties
                    })
                }
                else {
                    pro = await Product.create({
                        name, images: Array.from(new Set([...images])), 
                        description, price, amount, category
                    })
                }
            }
            else {
                pro = await Product.create({
                    name, images: Array.from(new Set([...images])), 
                    description, price, amount
                })
            }
            const product = await pro.save()        

            return (
                product 
                    ?
                res.status(201).json({message: "Product has been created successfully 😊"})            
                    :
                res.status(411).json({message: "something went wrong! 😕"})
            )
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 