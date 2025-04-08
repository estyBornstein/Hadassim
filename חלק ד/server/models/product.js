import { Schema, model } from "mongoose";

export const productSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    // img: String,
    price: {
        type: Number,
        require: true
    },
    minimumQuantity: {
        type: Number,
        default: 1
    },


});

export const productModel = model("product", productSchema);


