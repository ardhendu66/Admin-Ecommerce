import formidable, { IncomingForm } from "formidable";
import { NextApiRequest } from "next";
import path from "path";
import fs from "fs";


const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export type FormidableParseResult = {
    fields: formidable.Fields,
    files: formidable.Files,
};

export default async function parseForm(req: NextApiRequest): Promise<FormidableParseResult> {
    const form = new IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50 MB max file size
        maxFieldsSize: 20 * 1024 * 1024, // 20 MB max fields size
        multiples: false, // Set to true if multiple files allowed
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error("Formidable parse error:", err);
                return reject(err);
            }
            console.log("Form parsed successfully");
            resolve({ fields, files });
        });
    });
}