import { NextApiRequest, NextApiResponse } from "next"
import Categories from "@/lib/Categories"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'POST') {
            let category;
            if(req.body.parent === "") {
                const { name, properties } = req.body
                category = await Categories.create({name, properties})
            }
            else {               
                category = await Categories.create(req.body)
            }

            return (
                category
                    ?
                res.status(201).json({message: 'New Category created 😊'})
                    :
                res.status(403).json({message: 'Category creation failed 😣'})
            )
        }
    }
    catch(err: any) {
        console.error(err.message)
        return res.status(500).json({message: err.message})        
    }
}