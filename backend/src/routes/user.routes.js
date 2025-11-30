import {Router} from "express";
import { signupuser } from "../controllers/user.cotrollers.js";

const router = Router();
router.post("/register",signupuser)

export default router;