import { Router } from "express";
import { redirectUrlController, createUrlController, getAllUrlsController, getMyUrlsController, getAnalyticsController } from "../controllers/url_controller.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { optionalAuth, authenticate } from "../middlewares/auth.js";


const router = Router();



router.route("/create")
.post(authenticate, wrapAsync(createUrlController));

router.route("/urls")
.get(wrapAsync(getAllUrlsController));

router.route("/my-urls")
.get(authenticate, wrapAsync(getMyUrlsController));

router.route("/analytics")
.get(authenticate, wrapAsync(getAnalyticsController));



export default router;