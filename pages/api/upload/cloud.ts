import type { NextApiRequest, NextApiResponse } from "next";
import cloudUpload from "@/utils/cloud_upload";
import parseForm, { FormidableParseResult } from "@/utils/parseFormData";
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        console.log("Parsing form...");
        const { files } = await parseForm(req) as FormidableParseResult;
        const image = files.upload_image as formidable.File[];
        if (!image) {
            console.log("Invalid file receives from frontend");      
            return res.status(403).json({ message: "No file uploaded" });
        }
        console.log("Uploading to Cloudinary...");
        const data: any = await cloudUpload(image);
        // console.log("Upload complete", data);
        return res.status(201).json({
            url: data.secure_url, message: "Image uploaded successfully 🙂"
        });
    } catch (err: any) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: err.message });
    }
}