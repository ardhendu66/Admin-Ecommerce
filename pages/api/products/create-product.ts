import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'POST') {
            const { 
                name, 
                description, 
                price, 
                images, 
                amount, 
                category,
                subCategory, 
                categoryProperties, 
                discount, 
                sellerName, 
                adminId
            } = req.body
            
            let pro;
            if(category !== '') {
                if(Object.keys(categoryProperties).length > 0) {
                    pro = await Product.create({
                        name, 
                        category, 
                        description,
                        images: Array.from(new Set([...images])), 
                        price, 
                        amount,
                        subCategory, 
                        categoryProperties,
                        discountPercentage: discount, 
                        seller: sellerName,
                        adminId
                    })
                }
                else {
                    pro = await Product.create({
                        name, 
                        category, 
                        description, 
                        images: Array.from(new Set([...images])), 
                        price, 
                        amount,
                        subCategory, 
                        discountPercentage: discount,
                        seller: sellerName, 
                        adminId
                    })
                }
            }
            else {
                pro = await Product.create({
                    name, 
                    images: Array.from(new Set([...images])), 
                    description, 
                    price, 
                    amount, 
                    discountPercentage: discount, 
                    seller: sellerName,
                    adminId
                })
            } 
            
            if(pro) {
                return res.status(201).json({
                    message: "Product has been created successfully 😊"
                });
            }

            return res.status(205).json({message: "something went wrong! 😕"});
        }
    }
    catch(err) {
        console.error(err);        
        return res.status(500).json({message: "Creation failed. error code 500."})
    }
} 