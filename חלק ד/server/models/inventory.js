import { Schema, model } from "mongoose";

const inventorySchema = new Schema({
    name: {
        type: String,
        require: true
    },

    minimumQuantity: {
        type: Number,
        require: true
    },
    StockQuantity: {
        type: Number,
        default: 0
    },
    ProductVendors: [{
        type: Schema.Types.ObjectId,
        ref: "vendor",
        required: true
    }]
    
}


);

export const inventoryModel = model("inventory", inventorySchema);