import { Router } from "express";
import { getAllProductByVendorId, getProductById, getProductsByOrderId } from "../controller/product.js";

const router=Router();

// router.get("/vendor/:id", getAllProductByVendorId); 
// router.get("/:id",getProductsByOrderId)
router.get("/:id", getProductById); 



export default router;