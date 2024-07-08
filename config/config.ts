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
    domainName: string,
    jwtSecretKey: string,
    jwtExpiresIn: string,
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
    domainName: process.env.DOMAIN_NAME! as string,
    jwtSecretKey: process.env.JWT_SECRET_KEY! as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN! as string,
}

export const loaderColor = "#0369A1";

export interface UploadProductType {
    _id: string,
    brandName: string,
    brandImages: string[],
}