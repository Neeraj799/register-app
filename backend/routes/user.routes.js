import express from "express";
import { getUser, login, register } from "../controllers/auth.controller.js";
import { adminLogin } from "../controllers/admin.controller.js";

const router = express.Router();

//Admin
router.post("/admin/login", adminLogin);

//User
router.post("/register", register);

router.post("/login", login);

router.get("/", getUser);

export default router;
