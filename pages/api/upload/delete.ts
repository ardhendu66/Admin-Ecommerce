import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

ConnectionWithMongoose()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method === 'DELETE') {
            const { brand, name, image, index } = req.body
            const product = await Upload.findOne({name})
            
            let newImgArray: string[] = [], flag = false;
            if(product) {
                for(const key in product.brand) {
                    if(key === brand) {
                        flag = true;
                        newImgArray = product.brand[key].map((img: string, ind: number) => {
                            if(img === image && ind === index) {
                                return;
                            }
                            return img;
                        })
                        newImgArray = newImgArray.filter(img => typeof img !== "undefined")
                    }
                }

                if(flag) {
                    if(newImgArray.length === product.brand[brand].length) {
                        return res.status(404).json({message: "Image does not exist 🤔"})
                    }

                    const updatedProduct = await Upload.findOneAndUpdate({name}, {
                        $set: {
                            brand: {
                                ...product.brand,
                                [brand]: newImgArray
                            }
                        }
                    })
                    if(updatedProduct) {
                        return res.status(202).json({
                            message: 'Image has been deleted successfully'
                        })
                    }
                }
                else if(!flag) {
                    return res.status(406).json({message: 'Deletion failed for Invalid brand!'})
                } 
            }
            return res.status(404).json({message: "Product does not exist"})
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 