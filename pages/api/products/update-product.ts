import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if (req.method === 'PUT') {
            const {
                id, name, imageArray, description, price, discount, amount, category, subCategory, categoryProperties, sellerName,
            } = req.body

            const pro = await Product.findById(id); let product;
            
            if (category !== '') {
                if (Object.keys(categoryProperties).length > 0) {
                    product = await Product.findByIdAndUpdate(id, {
                        name, description, price, discountPercentage: discount, amount,
                        category, images: Array.from(new Set([...imageArray, ...pro.images])),
                        subCategory, categoryProperties, seller: sellerName
                    })
                }
                else {
                    product = await Product.findByIdAndUpdate(id, {
                        name, description, price, discountPercentage: discount, amount,
                        images: Array.from(new Set([...imageArray, ...pro.images])),
                        category, subCategory, seller: sellerName,
                    })
                }
            }
            else {
                product = await Product.findByIdAndUpdate(id, {
                    name, description, price, discountPercentage: discount, amount,
                    images: Array.from(new Set([...imageArray, ...pro.images])),
                    seller: sellerName
                })
            }

            return (
                product
                    ?
                res.status(202).json({ message: "Product updated successfully" })
                    :
                res.status(205).json({ message: "Product updation failed" })
            )
        }
    }
    catch (err: any) {
        return res.status(500).json({ message: "Product not updated :(" })
    }
} 