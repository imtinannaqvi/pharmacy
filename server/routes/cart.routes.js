import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.delete("/remove/:productId", auth, removeFromCart);

export default router;