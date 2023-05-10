import express from "express"
import { authMiddleware } from "../../middlewares/authMiddleware.js"
import * as usersController from "./users.controller.js"

const router = express.Router()

// GET - Get all users
router.get("/users", authMiddleware, usersController.getUsers)

// GET - Get user by id
router.get("/users/:id", authMiddleware, usersController.getUser)

// POST - Create a new user
router.post("/users", authMiddleware, usersController.createUser)

// PUT - Update user by id
router.put("/users/:id", authMiddleware, usersController.updateUser)

// DELETE - Delete user by id
router.delete("/users/:id", authMiddleware, usersController.deleteUser)

export default router
