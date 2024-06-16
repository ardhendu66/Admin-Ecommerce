import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'PUT') {
            const { name, image, brand } = req.body
            let product = await Upload.findOne({name})
            
            if(product) {
                let flag = false;
                for(const key in product.brand) {                    
                    if(key === brand) {
                        flag = true;                        
                        if(brand !== '') {
                            for(const key in product.brand) {
                                if(key === brand) {
                                    await Upload.findOneAndUpdate({name}, {
                                        $set: {
                                            brand: {
                                                ...product.brand,
                                                [key]: Array.from(new Set(
                                                    [...product.brand[key], image]
                                                )),
                                            }
                                        }
                                    })
                                }
                            }
        
                            return res.status(200).json({
                                message: "Image updation action successfull 🙂"
                            })
                        }
                    }
                }
                              
                if(!flag) return res.status(202).json({
                    message: "Brand does not exists 😕"
                })
            }
        
            return res.status(202).json({errMessage: "Image updation action failed 🤔"})
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 