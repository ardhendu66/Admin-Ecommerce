import { CategoryClass } from "./CategoryTypes";

export interface Product {
    _id: string,
    name: string,
    images: string[],
    description: string,
    price: number,
    discountPercentage: number,
    amount: number,
    __v: number,
    category: string,
    subCategory?: string,
    categoryProperties: Object,
    createdAt: Date,
    updatedAt: Date,
    seller: string,
    ratingAndReview?: {
        customerId?: {
            _id: string,
            name: string,
            email: string,
            phoneNo: string,
            __v: number,
        },
        rating: number,
        review?: string
    }
}

export interface ProductType {
    _id: string,
    name: string,
    brand: [{
        _id: string,
        brandName: string,
        brandImages: string[],
    }],
    __v: number
}