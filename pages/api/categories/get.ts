import { NextApiRequest, NextApiResponse } from "next"
import CategoryModel from "@/lib/Category";
import { ConnectionWithMongoose } from "@/lib/mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();

    if(req.method === 'GET') {
        try {
            if(req.query.id && req.query.sname) {
                const { id, sname }: any = req.query;
                const category = await CategoryModel.findById(id, {
                    subCategory: {
                        $elemMatch: {
                            name: sname
                        }
                    }
                })
                if(category) {
                    const newCategory = {
                        _id: category._id,
                        name: category.subCategory[0].name,
                        properties: category.subCategory[0].properties
                    }
                    return res.status(200).json(newCategory);
                }
                return res.status(205).json({message: "Category not found"});
            }

            const categories = await CategoryModel.find();

            if(categories) {
                return res.status(200).json(categories);
            }
            
            return res.status(205).json({message: 'Failed to fetch the Categories 😣'});
        }
        catch(err: any) {
            console.error(err.message)
            return res.status(500).json({message: err.message})        
        }
    }

    return res.status(405).json({message: "Method not allowed"})
}