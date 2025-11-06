import { Router } from "express";
import { redirectUrlController, createUrlController } from "../controllers/url_controller.js";
import { wrapAsync } from "../utils/wrapAsync.js";


const router = Router();

interface UrlParams {
    shortId: string;
}


router.route("/api/create")
.post(wrapAsync(createUrlController));

router.route("/:shortId")
.get(wrapAsync(redirectUrlController));



export default router;