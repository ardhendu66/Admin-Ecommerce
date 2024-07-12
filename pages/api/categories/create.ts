import { NextApiRequest, NextApiResponse } from "next"
import CategoryModel from "@/lib/Categories";
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'POST') {
            const { name, subCategory, properties } = req.body;
            const category = await CategoryModel.findOne({name});

            if(category) {
                if(category.subCategory.name && subCategory === category.subCategory.name) {
                    return res.status(200).json({message: "Sub-Category exists"})
                }
                else {
                    await CategoryModel.findOneAndUpdate({name}, {
                        $push: {
                            subCategory: {
                                name: subCategory,
                                properties
                            }
                        }
                    })
                    return res.status(202).json({message: "Sub-Category updated successfully"})
                }
            }
            
            await CategoryModel.create({
                name,
                subCategory: [
                    { name: subCategory, properties }
                ]
            })
            return res.status(201).json({message: "Category created successfully"})
        }
    }
    catch(err: any) {
        console.error(err.message)
        return res.status(500).json({message: err.message})     
    }
}