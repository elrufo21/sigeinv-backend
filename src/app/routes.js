import { Router } from "express";
import categoryRoutes from "../modules/categories/category.routes.js";
import productRoutes from "../modules/products/products.routes.js";

const router = Router();

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

export default router;
