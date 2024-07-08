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
        parent: {
            _id: '',
            name: '',
            __v: 0
        },
        __v: 0,
        properties: [{
            name: '',
            values: []
        }]
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