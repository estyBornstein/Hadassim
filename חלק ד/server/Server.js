import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectToDb } from "./config/db.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import vendorRouter from "./routes/vendor.js";
import purchaseRouter from "./routes/inventory.js";



dotenv.config();
connectToDb();

const app = express();

app.use(express.json());
app.use(cors());


// חיבור ה-router של ההזמנות
app.use("/api/buy", purchaseRouter);
app.use("/api/product", productRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/order", orderRouter);

const port = process.env.PORT;

app.listen(port, () => { console.log("app is listening on port " + port) })

