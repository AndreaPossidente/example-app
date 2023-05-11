import express from "express"
import { auth, hasPermissions, hasRoles } from "@middlewares/auth.middleware.js"
import rolesController from "./roles.controller.js"

const router = express.Router()

// GET - Get all roles
router.get("/roles", auth, hasRoles("admin"), hasPermissions("CAN_FETCH"), rolesController.getRoles)

// GET - Get role by id
router.get("/roles/:name", auth, hasRoles("admin"), hasPermissions("CAN_FETCH"), rolesController.getRole)

// POST - Create a new role
router.post("/roles", auth, hasRoles("admin"), hasPermissions("CAN_INSERT"), rolesController.createRole)

// PUT - Update role by id
router.put("/roles/:name", auth, hasRoles("admin"), hasPermissions("CAN_UPDATE"), rolesController.updateRole)

// DELETE - Delete role by id
router.delete("/roles/:name", auth, hasRoles("admin"), hasPermissions("CAN_DELETE"), rolesController.deleteRole)

export default router
