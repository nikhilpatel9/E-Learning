import express from "express";
import {  googleLogin, login, logout, register } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.post('/google-login', googleLogin);

export default router;