import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getVendorOrders, updateOrderStatus } from "../controllers/vendorController.js";

const router = express.Router();

router.use(protect, authorizeRoles("vendor"));

router.get("/orders", getVendorOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;