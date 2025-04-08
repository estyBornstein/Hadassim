import {inventoryModel} from "../models/inventory.js";
import { vendorModel } from "../models/vendor.js";
import { addOrder } from "./order.js";



export async function addVendorIdToInventoryProductByName(req, res) {
    const { name, vendorId } = req.body;
    console.log(name);
    console.log(vendorId);

    try {
        const product = await inventoryModel.findOne({ name });

        if (!product)
            return res.status(404).json({ title: "Not found", message: "No inventory item with that name." });

        // בדיקה אם הספק כבר קיים
        if (!product.ProductVendors.includes(vendorId)) {
            product.ProductVendors.push(vendorId);
            await product.save();  // לשמור את השינוי במסד הנתונים
        }
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json({ title: "Error", message: err.message });
    }
}

export async function handlePurchase(req, res) {
    const { items } = req.body; // נניח שמגיע [{ productName, quantity }]
    let warningMessage = ''; // כאן נשמור את ההודעה לבעל המכולת

    try {
        for (const item of items) {
            const { productName, quantity } = item;
            console.log(productName);

            const product = await inventoryModel.findOne({ name: productName }).populate("ProductVendors");
            if (!product) {
                return res.status(404).json({ message: `Product ${productName} not found in inventory` });
            }

            // בדיקת מלאי
            console.log(product.StockQuantity);
            if (product.StockQuantity < quantity) {
                return res.status(400).json({ message: `Not enough stock for ${productName}` });
            }

            // עדכון המלאי
            product.StockQuantity -= quantity;
            await product.save();

            // בדיקה אם ירד מתחת למינימום
            if (product.StockQuantity < product.minimumQuantity) {
                const vendors = product.ProductVendors;

                let cheapestVendor = null;
                let cheapestPrice = Infinity;
                let productIdForVendor = null;
                let min = 0; // כמות מינימלית לרכישה

                for (const vendor of vendors) {
                    const vendorFull = await vendorModel.findById(vendor._id);
                    const vendorProduct = vendorFull.goods.find(g => g.name === productName);

                    if (vendorProduct && vendorProduct.price < cheapestPrice) {
                        cheapestVendor = vendorFull;
                        cheapestPrice = vendorProduct.price;
                        productIdForVendor = vendorProduct._id;
                        min = vendorProduct.minimumQuantity;
                    }
                }

                if (cheapestVendor) {
                    const missingAmount = product.minimumQuantity - product.StockQuantity;
                    const amountToOrder = Math.max(min, missingAmount);

                    // קריאה לפונקציית addOrder
                    const orderReq = {
                        body: {
                            VendorCode: cheapestVendor._id,
                            OrderedGoods: [{
                                name: productName,
                                productId: productIdForVendor,
                                amount: amountToOrder
                            }]
                        }
                    };

                    // קריאה לפונקציה ישירות (בלי לשלוח תשובה ללקוח)
                    const fakeRes = {
                        status: () => fakeRes,
                        json: (data) => console.log("Auto-order created:", data)
                    };

                    await addOrder(orderReq, fakeRes);
                } else {
                    // אם לא נמצא ספק שמספק את המוצר, הוסף הודעת אזהרה לבעל המכולת
                    warningMessage += `No vendor found for ${productName}. `;
                }
            }
        }

        // אם הייתה אזהרה לגבי ספקים, נשלח את ההודעה לבעל המכולת
        if (warningMessage) {
            console.warn("Warning: " + warningMessage); // הדפסת אזהרה במערכת של בעל המכולת
        }

        // שליחת הודעה ללקוח שההזמנה בוצעה בהצלחה
        res.json({ message: "Purchase handled successfully" });

    } catch (err) {
        res.status(500).json({title:"mistake" ,message: err.message });
    }
}

