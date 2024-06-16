import { NextApiRequest, NextApiResponse } from "next"
import Product from "@/lib/Product"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function deleteImageAPI(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'DELETE' && req.query?.id) {
        try {
            const { id } = req.query  
            const { ind } = req.body     
            const product = await Product.findById(id)
            const images: string[] = []
            product.images.map((image: string, index: number) => {
                if(ind !== index) images.push(image)
            })        
            const newProduct = await Product.findByIdAndUpdate(id, {images: images})            
            return (
                newProduct
                    ?
                res.status(202).json({message: 'Image has been deleted successfully'})
                    :
                res.status(404).json({message: 'Image deletion failed'})
            )
        }
        catch(err: any) {
            return res.status(500).json({message: "internal server error :("})
        }
    }
}