import type { NextApiRequest, NextApiResponse } from "next";
import Upload from "@/lib/Upload";
import { ConnectionWithMongoose } from "@/lib/mongoose";

const defaultImage = "https://res.cloudinary.com/next-ecom-cloud/image/upload/v1722359725/profile_gspnec.jpg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();

    if (req.method === "POST") {

        try {
            const { name, brand, image, adminId } = req.query; 
            
            const existingBrand = await Upload.findOne({ name: name as string });

            if(existingBrand) {
                const updatedProduct = await Upload.findOneAndUpdate({name}, {
                    $push: {
                        brand: {
                            name: brand as string,
                            images: [image as string],
                            adminId: adminId as string,
                        }
                    }
                })

                if(updatedProduct) {
                    return res.status(201).json({
                        message: "Image uploaded successfully",
                        updatedProduct
                    });
                }

                return res.status(403).json({message: "Product creation failed"});
            }

            const uploadedData = await Upload.create({
                name: name as string,
                brand: [{
                    name: brand as string,
                    images: [image as string || defaultImage],
                    adminId: adminId as string,
                }],
            });


            return res.status(201).json({
                message: "Upload category created successfully",
                data: uploadedData
            });

        }
        catch (err) {
            console.error(err);
            return res.status(500).json({err})
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
}