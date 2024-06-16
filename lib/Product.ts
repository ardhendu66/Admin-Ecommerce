import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product_name is required"],
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    images: {
        type: Array(String),
        required: [true, "Image source or image-link required"]
    },
    description: {
        type: String,
        required: [true, "Product_description is required"],
    },
    price: {
        type: Number,
        required: [true, "without Product_price product can't be added"]
    },
    amount: {
        type: Number,
        required: [true, "amount should be required"],
        min: [0, "amount cannot be negetive"]
    },
    categoryProperties: {
        type: Object
    }},
    { timestamps: true }
)

export default mongoose.models?.Product || mongoose.model('Product', productSchema)