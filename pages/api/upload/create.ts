import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"


interface Body {
    name: string,
    brand: string,
    image: string,
    adminId: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();

    if(req.method === "POST") {
        try {
            const { name, brand, image, adminId }: Body = req.body;

            const imageValue = ( image !== undefined || image !== null || image !== "" ) ? image : "https://res.cloudinary.com/next-ecom-cloud/image/upload/v1722359725/profile_gspnec.jpg";

            let product = await Upload.findOne({name});

            if(product) {
                const existingBrand = product.brand.find((ele: any) => ele.name === brand);

                if(existingBrand) {
                    return res.status(200).json({ message: "Brand already exist" });
                }

/**

              const updatedProduct = await Upload.findOneAndUpdate({name}, {
                    $push: {
                        brand: {
                            name: brand,
                            images: [imageValue],
                            adminId
                        }
                    }
                })

                if(updatedProduct) {
                    return res.status(201).json({
                        message: "Product created successfully",
                        updatedProduct
                    });
                }

                return res.status(403).json({message: "Product creation failed"});

**/

            }


            const uploadedData = await Upload.create({
                name,
                brand: [{
                    name: brand,
                    images: [image],
                    adminId
                }],
            });
            
            return res.status(201).json({
                message: "Upload category created successfully",
                uploadedData
            });
        }
        catch(err: any) {
            return res.status(500).json({message: err.message})
        }
    }

    return res.status(405).json("Method not allowed");
} 