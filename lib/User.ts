import mongoose from "mongoose";

export interface User extends mongoose.Document {
    name: string,
    username: string,
    email: string,
    password: string,
    image: string,
    emailVerified: boolean,
    verifiedAsAdmin: boolean,
    verifyToken: string,
    forgotPasswordToken: string,
    verifyTokenExpiry: Date,
    forgotPasswordTokenExpiry: Date,
}

export const userSchema: mongoose.Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        trim: true,
        minlength: [6, "Name must be of 6 characters"],
        maxlength: [80, "Name does not exceed 80 characters"],
    },
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true,
        trim: true,
        minlength: [6, "Username must be of 6 characters"],
        maxlength: [20, "Name does not exceed 20 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        trim: true,
        validate(value: string) {
            if(value.includes('@')) {
                return true;
            }
            console.log("Invalid Email id")
            return false;
        }
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        trim: true,
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        trim: true,
        default: "https://res.cloudinary.com/next-ecom-cloud/image/upload/v1717239604/pexels-pixabay-220429_bngcul.jpg"
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    verifiedAsAdmin: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
    },
    forgotPasswordToken: {
        type: String,
    },
    verifyTokenExpiry: {
        type: Date,
        default: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    }
})

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

export default UserModel;