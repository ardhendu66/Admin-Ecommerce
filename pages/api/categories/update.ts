import { NextApiRequest, NextApiResponse } from "next"
import CategoryModel from "@/lib/Category";
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'PUT') {
            const { 
                id, updatedSubCategoryName, subCategoryName, properties, adminId 
            } = req.body;

            const category = await CategoryModel.findOneAndUpdate({
                _id: id,
                "subCategory.name": subCategoryName,
            }, {
                $set: {
                    "subCategory.$.name": updatedSubCategoryName || subCategoryName,
                    "subCategory.$.properties": properties,
                    "subCategory.$.adminId": adminId,
                }
            })
            
            if(category) {
                return res.status(202).json({message: "Category updated successfully"})
            }

            return res.status(200).json({message: "Category not updated"})
        }
    }
    catch(err: any) {
        console.error(err.message)
        return res.status(500).json({message: err.message})        
    }
}