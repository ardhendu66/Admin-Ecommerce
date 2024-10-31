import Upload from "@/pages/upload";
import { Schema, model, models, Document, Types } from "mongoose";

interface Brand extends Document {
    name: string,
    images: string[],
    adminId?: Types.ObjectId,
}

const brandSchema: Schema<Brand> = new Schema<Brand>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    images: [String],
    adminId: {
        type: Types.ObjectId,
        ref: "Admin",
        required: true,
    }
}, {
    _id: true,
    timestamps: true,
})

interface Upload extends Document {
    name: string,
    brand: Brand[],
}

const uploadSchema: Schema<Upload> = new Schema<Upload>({
    name: {
        type: String,
        required: [true, "name required"],
        unique: true,
    },
    brand: {
        type: Array(brandSchema),
    }
}, {
    timestamps: true,
})

export default models?.Upload || model('Upload', uploadSchema)