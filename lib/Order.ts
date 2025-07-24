import { Schema, Document, models, model } from "mongoose";

interface Order extends Document {
    items: Object,
    name: string,
    phoneNumber: string,
    email: string,
    city: string,
    pinCode: string,
    streetAddress: string,
    paid: boolean,
    image: string,
}

const orderSchema: Schema<Order> = new Schema({
    items: {
        type: Object,
    },
    name: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    city: {
        type: String,
    },
    pinCode: {
        type: String,
    },
    streetAddress: {
        type: String,
    },
    paid: {
        type: Boolean,
    },
    image: {
        type: String,
    }
}, {
    timestamps: true,
})

const Order = models?.Order || model('Order', orderSchema);

export default Order;