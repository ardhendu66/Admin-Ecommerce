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
    category: {
        _id: '',
        name: '',
        subCategory: [{
            name: '',
            properties: {}
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
    },
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