import { Router } from "express";
import categoryRoutes from "../modules/categories/category.routes.js";

const router = Router();

router.use("/categories", categoryRoutes);

export default router;
