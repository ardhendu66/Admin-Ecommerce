export interface UploadItemType {
    _id: string,
    name: string,
    brand: [{
        _id: string,
        name: string,
        images: string[],
        createdAt: Date,
        updatedAt: Date,
        adminId: string,
    }],
    createdAt: Date,
    updatedAt: Date
}