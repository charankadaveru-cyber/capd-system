import express from "express";
import { body } from "express-validator";
import { createOrder, getPatientOrders } from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("patient"));

router.post(
    "/orders",
    [
        body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
        body("address").notEmpty().withMessage("Address is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("pincode").notEmpty().withMessage("Pincode is required"),
    ],
    createOrder
);

router.get("/orders", getPatientOrders);

export default router;