import express from "express"
import * as authController from "./auth.controller.js"

const router = express.Router()

router.post("/login", authController.login)

router.post("/signup", authController.signup)

export default router
