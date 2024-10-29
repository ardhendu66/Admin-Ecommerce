import mongoose from "mongoose"

const uploadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Fill the type of Product"],
        unique: true,
    },
    brand: {
        type: Object,
    }
}, {
    timestamps: true,
})

export default mongoose.models?.Upload || mongoose.model('Upload', uploadSchema)