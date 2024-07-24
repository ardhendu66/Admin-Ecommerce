
import formidable, { IncomingForm } from "formidable";
import { NextApiRequest } from "next";

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
    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            resolve({ fields, files });
        });
    });
}