import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    if (req.method === 'PUT') {
        try {
            const {
                id, 
                name, 
                imageArray, 
                description, 
                price, 
                discount, 
                amount, 
                category, 
                subCategory, 
                categoryProperties, 
                sellerName,
                adminId
            } = req.body;

            const pro = await Product.findOne({_id: id, adminId});

            let product;
            
            if (category !== '') {
                if (Object.keys(categoryProperties).length > 0) {
                    product = await Product.findOneAndUpdate({_id: id, adminId}, {
                        $set: {
                            name, 
                            category, 
                            description, 
                            price, 
                            discountPercentage: discount, 
                            amount,
                            subCategory, 
                            categoryProperties, 
                            seller: sellerName,
                            images: Array.from(new Set([...imageArray, ...pro.images])),
                        },
                    })
                }
                else {
                    product = await Product.findOneAndUpdate({_id: id, adminId}, {
                        $set: {
                            name, 
                            category, 
                            description, 
                            price, 
                            discountPercentage: discount, 
                            amount,
                            subCategory, 
                            seller: sellerName,
                            images: Array.from(new Set([...imageArray, ...pro.images])),
                        },
                    })
                }
            }
            else {
                product = await Product.findOneAndUpdate({_id: id, adminId}, {
                    $set: {
                        name, 
                        description, 
                        price, 
                        discountPercentage: discount, 
                        amount,
                        seller: sellerName,
                        images: Array.from(new Set([...imageArray, ...pro.images])),
                    }
                })
            }

            if(product) {
                return res.status(202).json({ message: "Product updated successfully" });
            }

            return res.status(205).json({ message: "Product updation failed" });
        }
        catch(err) {
            console.error(err);            
            return res.status(500).json({ message: "Updation failed. error code 500." })
        }
    }

    return res.status(405).json({message: "Method not allowed"});
} 