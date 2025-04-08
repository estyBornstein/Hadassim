import { Router } from "express";
import {  getAllVendors, getVendorrById, login, signUp } from "../controller/vendor.js";
import { addVendorIdToInventoryProductByName } from "../controller/inventory.js";



const router = Router();

router.get("/", getAllVendors);
router.get("/:id", getVendorrById);
router.post("/", signUp);
router.post("/addProduct",addVendorIdToInventoryProductByName)
router.post("/login", login);



export default router;