import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { envVariables } from "@/config/config";
import formidable from "formidable";

cloudinary.config({
    cloud_name: envVariables.cloudinaryUploadCloud,
    api_key: envVariables.cloudinaryApiKey,
    api_secret: envVariables.cloudinaryApiSecret,
});

export default function cloudUpload(file: formidable.File[]) {
    const filePath = file[0].filepath;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                chunk_size: 6000000, // 6 MB chunk size
            },
            (err, result) => {
                fs.unlinkSync(filePath); // Clean up temp file after upload
                if (err) {
                    console.error("Cloudinary upload error:", err);
                    reject(new Error("Cloudinary upload failed"));
                } else {
                    console.log("Cloudinary upload result:", result);
                    resolve(result);
                }
            }
        );

        fs.createReadStream(filePath).pipe(uploadStream);
    });
}