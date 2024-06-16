import mongoose from "mongoose"

const uploadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Fill the type of Product"],
    },
    brand: {
        type: Object,
        required: [true, "Must fill all brand details"],
    }
})

export default mongoose.models?.Upload || mongoose.model('Upload', uploadSchema)