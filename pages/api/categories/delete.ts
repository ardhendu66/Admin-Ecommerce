import { NextApiRequest, NextApiResponse } from "next"
import Categories from "@/lib/Categories"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'DELETE') {
            const category = await Categories.findByIdAndDelete(req.body.id)
            if(category) {
                return res.status(202).json({message: ' has been deleted successfully 😊'})
            }
            return res.status(203).json({message: 'Category deletion failed 😒'})
        }
    }
    catch(err: any) {
        console.error(err.message)
        return res.status(500).json({message: err.message})        
    }
}