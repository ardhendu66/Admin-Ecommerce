import { Schema, model, models, Types, Document } from "mongoose";

interface CustomerClass extends Document {
    name: string, 
    email: string,
    phoneNo: string,
}

const customerSchema: Schema<CustomerClass> = new Schema<CustomerClass>({
    name: {
        type: String,
        default: "Ardhendu Roy"
    },
    email: {
        type: String,
        validate: {
            validator(value: string) {
                if(!value.includes("@") || value.length < 6) {
                    return false;
                }
            },
            message({value}) {
                return `EmailId-${value} is not valid`
            }
        },
        default: "ardhendu@gmail.com"
    },
    phoneNo: {
        type: String,
        validate: {
            validator(value: string) {
                if(value.length !== 10) {
                    return value;
                }
            },
            message({value}) {
                return `${value} does not contain 10 digits`
            }
        },
        default: "9517890762"
    }
}, {
    timestamps: true,
})

const Customer = models?.Customer || model('Customer', customerSchema);

export default Customer;