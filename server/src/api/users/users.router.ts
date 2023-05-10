import express from "express"
import { auth, hasPermissions, hasRoles } from "../../middlewares/auth.middleware.js"
import * as usersController from "./users.controller.js"

const router = express.Router()

// GET - Get all users
router.get("/users", auth, hasRoles("admin"), hasPermissions("CAN_FETCH"), usersController.getUsers)

// GET - Get user by id
router.get("/users/:id", auth, hasRoles("admin"), hasPermissions("CAN_FETCH"), usersController.getUser)

// POST - Create a new user
router.post("/users", auth, hasRoles("admin"), hasPermissions("CAN_INSERT"), usersController.createUser)

// PUT - Update user by id
router.put("/users/:id", auth, hasRoles("admin"), hasPermissions("CAN_UPDATE"), usersController.updateUser)

// DELETE - Delete user by id
router.delete("/users/:id", auth, hasRoles("admin"), hasPermissions("CAN_DELETE"), usersController.deleteUser)

export default router
