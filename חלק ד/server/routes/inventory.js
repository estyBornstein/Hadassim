import express from 'express';
import { handlePurchase } from '../controller/inventory.js';  // ייבוא הפונקציה שלך

const router = express.Router();

// יצירת ה-Route שמטפל בהזמנות
router.post('/purchase', handlePurchase);

export default router;
