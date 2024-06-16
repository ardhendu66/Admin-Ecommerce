import { NextApiRequest, NextApiResponse } from "next"
import Categories from "@/lib/Categories"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'GET') {
            const categories = await Categories.find({}).populate('parent')

            return (
                categories
                    ?
                res.status(200).json(categories)
                    :
                res.status(403).json({message: 'Failed to fetch the Categories 😣'})
            )
        }
    }
    catch(err: any) {
        console.error(err.message)
        return res.status(500).json({message: err.message})        
    }
}