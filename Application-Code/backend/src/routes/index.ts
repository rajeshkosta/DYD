import {Router} from "express";
import userRouters from "./userRoutes";
import freepikRouters from "./freePikRoutes";
import mediaRouters from "./mediaRoutes";
import orderRouters from "./orderRoutes";
import adminRouters from "./adminRoutes";
import productRouter from "./productRoutes";
import pageRouter from "./pageRoutes";

const router = Router();

router.use('/user', userRouters )
router.use('/media', mediaRouters )
router.use('/freepik', freepikRouters)
router.use('/order', orderRouters)
router.use('/admin', adminRouters)
router.use('/product', productRouter)
router.use('/page', pageRouter)



export default router