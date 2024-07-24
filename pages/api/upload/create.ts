import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"
interface Body {
    name: string,
    brand: string,
    image: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === "POST") {
            const { name, brand, image }: Body = req.body;
            const brand_updated = (
                (brand !== '') ? brand.charAt(0).toUpperCase() + brand.slice(1) : null
            );
            let pro = await Upload.findOne({name});

            if(pro) {
                if(pro.brand[brand]) {
                    return res.status(200).json({message: "Product already exists"});
                }

                const newBrand = {
                    [brand]: [image],
                    ...pro.brand
                }
                const updatedProduct = await Upload.findOneAndUpdate({name}, {
                    $set: {
                        brand: newBrand
                    }
                })
                if(updatedProduct) {
                    return res.status(201).json({message: "Product created successfully"});
                }

                return res.status(403).json({message: "Product creation failed"});
            }

            const product = await Upload.create({
                name,
                brand: {
                    [brand]: [image]
                }
            })
            return res.status(201).json({
                message: "Brand creation successfull", product: product
            })
        }
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 