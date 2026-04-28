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
import listingsRouter from "./listings";
import requestsRouter from "./requests";
import walletRouter from "./wallet";
import referralsRouter from "./referrals";

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
router.use(listingsRouter);
router.use(requestsRouter);
router.use(walletRouter);
router.use(referralsRouter);

export default router;
