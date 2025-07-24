export interface SubCategoryExtended {
    _id: string,
    name: string,
    properties: Object,
}
export interface SubCategoryClass {
    name: string,
    properties: Object,
    adminId?: string,
}
export interface CategoryClass {
    _id: string,
    name: string,
    subCategory: SubCategoryClass[],
    createdAt: Date,
    updatedAt: Date,
    __v: number
}