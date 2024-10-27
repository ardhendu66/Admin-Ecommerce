import { Schema, model, models, Document, Types } from "mongoose"

interface SubCategoryClass extends Document {
    name: string,
    properties: Object,
    adminId?: Types.ObjectId,
}

const subCategorySchema: Schema<SubCategoryClass> = new Schema<SubCategoryClass>({
    name: {
        type: String,
        required: [true, "sub-category-name is required"],
        unique: true,
    },
    properties: {
        type: Object,
        required: [true, "category-properties is required"]
    },
    adminId: {
        type: Types.ObjectId,
        ref: "Admin",
        required: true,
    }
}, {_id: false})

interface CategoryClass extends Document {
    name: string,
    subCategory: SubCategoryClass[]
}

const categorySchema: Schema<CategoryClass> = new Schema<CategoryClass>({
    name: {
        type: String,
        required: [true, 'Name must be required'],
        unique: true,
    },
    subCategory: {
        type: Array(subCategorySchema)
    }
}, {
    timestamps: true,
})

const CategoryModel = models?.Category || model('Category', categorySchema);

export default CategoryModel;