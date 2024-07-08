import { Schema, Document, model, models, Types } from "mongoose";

interface RatingsAndReviewsClass extends Document {
    customerId?: Types.ObjectId,
    rating: number,
    review?: string,
}

const ratingReviewSchema: Schema<RatingsAndReviewsClass> = new Schema<RatingsAndReviewsClass>({
    customerId: {
        type: Types.ObjectId,
        ref: "Customer"
    },
    rating: {
        type: Number,
        enum: {
            values: [1, 2, 3, 4, 5],
            message: '{VALUE} is not accepted as Rating',
        }
    },
    review: {
        type: String,
        maxlength: [300, "Maximum 300 characters for review description"]
    }
}, {
    _id: false,
})

interface ProductClass extends Document {
    name: string,
    category?: Types.ObjectId,
    images: string[],
    description: string,
    price: number,
    discountPercentage: number,
    seller: string,
    amount: number,
    categoryProperties: Object,
    ratingAndReview?: RatingsAndReviewsClass[]
}

const productSchema: Schema<ProductClass> = new Schema<ProductClass>({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    category: {
        type: Types.ObjectId,
        ref: "Category"
    },
    images: {
        type: Array(String),
        required: [true, "Image is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negetive"],
        max: [1000000, "Maximum price limit is 1million rupee"],
    },
    discountPercentage: {
        type: Number,
        required: [true, "Discount_Percentage required"],
        min: [0, "Percentage cannot be negetive"],
        max: [100, "Percentage cannot exceed 100"],
    },
    seller: {
        type: String,
        required: [true, "Seller_name required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negetive"]
    },
    categoryProperties: {
        type: Object
    },
    ratingAndReview: Array(ratingReviewSchema)
}, {
    timestamps: true
})

const Product = models?.Product || model('Product', productSchema);

export default Product;