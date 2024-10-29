import { NextApiRequest, NextApiResponse } from "next"
import Upload from "@/lib/Upload"
import { ConnectionWithMongoose } from "@/lib/mongoose"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectionWithMongoose();
    try {
        if(req.method === 'DELETE') {
            const { brand, name, image, index } = req.body;
            console.log("request_body : ", req.body);

            const deletedImage = await Upload.findOneAndUpdate({name}, {
                $pull: {
                    [`brand.${brand}`]: image
                }
            })

            if(deletedImage) {
                console.log(deletedImage + " has been deleted successfully");                
                return res.status(202).json({message: "Image has been deleted successfully"});
            }

            return res.status(406).json({message: 'Deletion failed!'})
        }

        return res.status(405).json({message: "Method not allowed"});
    }
    catch(err: any) {
        return res.status(500).json({message: err.message})
    }
} 