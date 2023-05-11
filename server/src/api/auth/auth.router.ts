import express from "express"
import authController from "./auth.controller.js"

const router = express.Router()

// POST - login
router.post("/login", authController.login)

// POST - signup
router.post("/signup", authController.signup)

export default router
