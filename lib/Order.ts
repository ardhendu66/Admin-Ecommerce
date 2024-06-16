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
    }
}, {
    timestamps: true,
})

const Order = models?.Order || model('Order', orderSchema);

export default Order;