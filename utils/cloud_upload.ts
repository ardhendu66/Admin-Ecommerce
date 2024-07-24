import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { envVariables } from "@/config/config";
import formidable from "formidable";

cloudinary.config({
    cloud_name: envVariables.cloudinaryUploadCloud,
    api_key: envVariables.cloudinaryApiKey,
    api_secret: envVariables.cloudinaryApiSecret,
});

export default async function cloudUpload(file: formidable.File[]) {
    const path = file[0].filepath;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (err, result) => {
                fs.unlinkSync(path); // Remove the file after upload
                if (err) {
                    console.error("Cloudinary upload error:", err);
                    reject(err);
                } else {
                    // console.log("Cloudinary upload result:", result);
                    resolve(result);
                }
            }
        );

        fs.createReadStream(path).pipe(uploadStream);
    })
}