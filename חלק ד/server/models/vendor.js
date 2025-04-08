import { Schema, Types, model } from "mongoose";
import { productModel, productSchema } from "./product.js";



// יצירת סכימת משתמש
const vendorSchema = new Schema({
   companyName: {
      type: String,
      minlength: 2,
      require: true
   },
   password: {
      type: String,
      minlength: 6, // מינימום 6 תווים
      require:true
   },
   phone: {
      type: String,
      require: true,
      unique: true,
      match: [/^\d{9,10}$/, 'Phone number must be 9 or 10 digits']
   },
   representativeName: {
      type: String,
      minlength: 2,
   },
   goods: {
      type: [productSchema],
      require: true
   },
   role: {
      type: String,
      enum: ['VENDOR', 'ADMIN'],
      default: "VENDOR",
   
  }
});

// יצירת מודל וייצואו
export const vendorModel = model("vendor", vendorSchema);


