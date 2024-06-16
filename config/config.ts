interface EnvironmentVariables {
    googleAuthId: string,
    googleAuthSecret: string,
    mongodbUrl: string,
    mongoLocalUrl: string,
    cloudinaryUploadPreset: string,
    cloudinaryUploadCloud: string,
    cloudinaryApiKey: string,
    nextAuthSecretKey: string,
    productionEmail: string,
    productionPassSecret: string,
    mailSendToEmail: string,
    privateDomain: string,
    localDomain: string,
}

export const envVariables: EnvironmentVariables = {
    googleAuthId: process.env.GOOGLE_ID! as string,
    googleAuthSecret: process.env.GOOGLE_SECRET! as string,
    mongodbUrl: process.env.MONGODB_URI! as string,
    mongoLocalUrl: process.env.LOCAL_MONGODB_URI! as string,
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET! as string,
    cloudinaryUploadCloud: process.env.CLOUDINARY_UPLOAD_CLOUD! as string,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY! as string,
    nextAuthSecretKey: process.env.SECRET_KEY_AUTH! as string,
    productionEmail: process.env.PRODUCTION_EMAIL! as string,
    productionPassSecret: process.env.PRODUCTION_EMAIL_PASSWORD! as string,
    mailSendToEmail: process.env.MAIL_SEND_TO_EMAIL! as string,
    privateDomain: process.env.PRIVATE_DOMAIN! as string,
    localDomain: process.env.PRIVATE_LOCAL_DOMAIN! as string,
}

export interface Product {
    _id: string,
    name: string,
    images: string[],
    description: string,
    price: number,
    amount: number,
    __v: number,
    category: CategoryType,
    categoryProperties: Object,
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

export interface UploadProductType {
    _id: string,
    brandName: string,
    brandImages: string[],
}

export interface Category {
    _id: string,
    name: string,
    parent: string,
    __v: number
}

export interface CategoryType {
    _id: string,
    name: string,
    __v: number,
    parent?: {
        _id?: string,
        name?: string,
        __v?: number,
    },
    properties: Object,
}

export interface PropertyType {
    catName: string,
    properties: Object
}

export interface CatProperty {
    catName: string,
    properties: Object
}