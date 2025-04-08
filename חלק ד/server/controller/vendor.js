import { productModel } from "../models/product.js";
import { vendorModel } from "../models/vendor.js";
import { generateToken } from "../utils/jwt.js";

import bcrypt from 'bcryptjs'



export async function login(req, res) {
    console.log(123);
    let { phone, password } = req.body
    if (!phone || !password)
        return res.status(404).json({ title: "cannot login", message: "phone and  password  are required" })

    try {
        let result = await vendorModel.findOne({ phone: phone })
        if (!result)
            return res.status(404).json({ title: "cannot login", message: "no vendor with such phone" })

        // השוואת הסיסמה המוצפנת לסיסמה שהוזנה
        const isMatch = await bcrypt.compare(password, result.password);  // השוואת הסיסמה המוצפנת

        if (!isMatch)
            return res.status(404).json({ title: "cannot login", message: "wrong password" })

        let token = generateToken(result);

        // הפיכת ה-Document לאובייקט רגיל והסרת הסיסמה
        let vendor = result.toObject();
        vendor.password = undefined;
        vendor.token = token;

        res.json(vendor);
    }
    catch (err) {
        res.status(400).json({ title: "Failed to login", message: err.message })
    }
}

export async function signUp(req, res, next) {
    let { body } = req;
    console.log(body);
    if (!body.goods || !body.password || !body.phone || !body.companyName)
        return res.status(404).json({ title: "missing data in body", message: "goods password phone and companyName are required" })

    try {
        let result = await vendorModel.findOne({ phone: body.phone });
        if (result)
            return res.status(409).json({ title: "cannot add ", message: "Your phone number exists. You are already in the system. " })
        
        // הוספתי את הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        let products = [];
        if (Array.isArray(body.goods)) {
            for (let prod of body.goods) {
                let newProduct = await productModel.create(prod);
                products.push(newProduct);
            }
        }

        // יצירת אובייקט משתמש חדש עם הסיסמה המוצפנת
        let newVendor = new vendorModel({
            ...body,
            password: hashedPassword,
            goods: products
        });
        await newVendor.save()
        
        let token = generateToken(newVendor);  // יצירת טוקן 
        let { password, ...other } = newVendor.toObject();  // הסרת הסיסמה לפני שליחה
        other.token = token;
        
        res.json(other);  // שליחת פרטי המשתמש עם הטוקן

        // קריאה ל-next על מנת לעבור לפונקציה הבאה אם יש צורך
        // next();  // אם יש פונקציה שאחריה אתה רוצה לקרוא לה, תוסיף כאן
    }
    catch (err) {
        res.status(400).json({ title: "Failed to add the vendor", message: err.message })
    }
};

export async function getAllVendors(req, res) {
    try {
        // vendorModel.find({role=='VENDOR'}) לשנות אחרי מחיקה ממונגו ל
        // חיפוש ספקים עם role="VENDOR" או אין להם תפקיד (role לא קיים או ריק)
        let result = await vendorModel.find({
            $or: [
                { role: "VENDOR" },
                { role: { $exists: false } },  // במקרה שה-`role` לא קיים בכלל
                { role: "" }  // במקרה שה-`role` ריק
            ]
        });

        if (result.length === 0) {
            return res.json("No vendors or users without role found");
        }

        res.json(result);
    } catch (err) {
        res.status(400).json({ title: "Failed to fetch vendors or users without role", message: err.message });
    }
            }

export async function getVendorrById(req, res) {
    let { id } = req.params;

    try {
        let result = await vendorModel.findById(id)
        if (!result)
            return res.status(404).json({ title: "Problem with the id", message: "There is no vendor with such id." })
        res.json(result)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to bring the vendor by id", message: err.message })
    }
};


