import {Router} from "express";
import { loginuser, registeruser,logoutuser,generatenewaccesstoken } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();
router.route("/register").post(
    upload.single("avatar"),
    registeruser);

router.route("/login").post(loginuser);

router.route("/logout").post(verifyJWT,logoutuser);

router.route("/newaccesstoken").post(generatenewaccesstoken);

export default router;