import {Router} from "express";
import { signupuser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js"

const router = Router();
router.route("/register").post(
    upload.single("avatar"),
    signupuser);

export default router;