import { Product } from "@/config/ProductTypes";

export const defaultProductAttributes: Product = {
    _id: '',
    name: '',
    description: '',
    images: [],
    price: Number(),
    discountPercentage: Number(),
    amount: Number(),
    __v: 0,
    category: '',
    categoryProperties: {},
    seller: '',
    ratingAndReview: {
        customerId: {
            _id: '',
            __v: 0,
            name: '',
            email: '',
            phoneNo: '',
        },
        rating: Number(),
        review: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
}