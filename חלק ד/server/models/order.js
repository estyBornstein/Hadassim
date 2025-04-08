import { Schema, Types, model } from "mongoose"
import { productModel, productSchema } from "./product.js"



const orderSchema = Schema({
    orderDate: { type: Date, default: new Date() },
    deadline: {
        type: Date, default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 7); // מוסיף 7 ימים לתאריך הנוכחי
            return date;
        },
    },
    VendorCode: {
        type: Schema.Types.ObjectId,
        ref: "vendor",
        require: true
    },
    OrderedGoods: {
        type: [
            {
                name:String,
                productId: Schema.Types.ObjectId,//לבדוק אם חסר ref
                amount: Number,
            },

        ], require: true
    },
    status: {
        type: String,
        enum: ['APPROVED', 'ACCEPTED', 'PENDING'],
        default: "PENDING"
    }

})
export const orderModel = model("order", orderSchema)
