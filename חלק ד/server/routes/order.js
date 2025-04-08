import { Router } from "express";
import { addOrder, getAllOrders, getAllOrdersInProgress, getOrderByVentorId, updateOrder_status } from "../controller/order.js";
import { isExist } from "../middleware/check.js";



const router = Router();
router.get("/", getAllOrders);
router.get("/InProgress", getAllOrdersInProgress);
router.get("/:id", getOrderByVentorId);
router.post("/", addOrder);
router.put("/:id",isExist, updateOrder_status);
export default router;