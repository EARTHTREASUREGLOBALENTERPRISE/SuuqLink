import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import vendorsRouter from "./vendors";
import productsRouter from "./products";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import chatRouter from "./chat";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(vendorsRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(chatRouter);
router.use(adminRouter);

export default router;
