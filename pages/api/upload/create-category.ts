import type { NextApiRequest, NextApiResponse } from "next";
import Upload from "@/lib/Upload";
import { ConnectionWithMongoose } from "@/lib/mongoose";

const defaultImage = "https://res.cloudinary.com/next-ecom-cloud/image/upload/v1722359725/profile_gspnec.jpg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();

    if (req.method === "POST") {

        try {
            const { name, brand, adminId } = req.query;         

            const uploadedData = await Upload.create({
                name,
                brand: [{
                    name: brand,
                    images: [defaultImage],
                    adminId
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


// async function manageIndexes(res: NextApiResponse) {
//     try {
//         // List current indexes
//         const indexes = await Upload.collection.listIndexes().toArray();
//         console.log("Current Indexes:", indexes);

//         const indexName = "brand.brandName_1";
//         const indexExists = indexes.some(index => index.name === indexName);

//         // Check if the index exists and drop it
//         let data;
//         if (indexExists) {
//             data = await Upload.collection.dropIndex(indexName);
//             console.log(`Dropped index: ${indexName}`);
//         } else {
//             console.log(`Index ${indexName} does not exist.`);
//         }

//         // Create a new partial index
//         const data1 = await Upload.collection.createIndex(
//             { "brand.brandName": 1 },
//             { unique: true, partialFilterExpression: { "brand.brandName": { $type: "string" } } }
//         );
//         console.log("Created new partial index for brand.brandName");

//         return res.status(200).json({ data, data1 })
//     }
//     catch(err) {
//         console.error(err);        
//     }
// }