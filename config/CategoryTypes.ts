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

export interface CatProperty {
    catName: string,
    properties: Object
}

export interface PropertyType {
    catName: string,
    properties: Object
}