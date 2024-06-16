import { NextApiRequest, NextApiResponse } from "next"
import Categories from "@/lib/Categories"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'PUT') {
            let category;
            if(req.body.parent === "") {
                const { name, id, properties } = req.body
                
                await Categories.findByIdAndUpdate(id, {
                    name, properties 
                    // $unset: { parent: 1 },
                })
                category = await Categories.findById(id)
            }
            else {
                const { id, name, parent, properties } = req.body
                await Categories.findByIdAndUpdate(id, {
                    name, parent, properties
                })
                category = await Categories.findById(id)
            }

            return (
                category
                    ?
                res.status(202).json({message: 'Category has been updated 😊'})
                    :
                res.status(403).json({message: 'Category updation failed 😣'})
            )
        }
    }
    catch(err: any) {
        console.error(err.message)
        return res.status(500).json({message: err.message})        
    }
}