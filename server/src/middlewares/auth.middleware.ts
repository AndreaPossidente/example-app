import type { Request, Response, NextFunction } from "express"
import type { Permission } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const { SECRET = "" } = process.env

/**
 * **Middleware to set a user property into the Request and block it if there's no authorization header**
 *
 * If the authorization token is set and is valid, it will set the req.user object and continue to the next middleware, if authorization token isn't set, it will block the request
 *
 * @example
 * app.get("/users", auth, (req, res) => {
 *   // note: if the authorization token has not been sent or isn't valid, this code will never run
 *   const { user } = req // it will be available if authorization token is valid
 * })
 */
export function auth(req: Request, res: Response, next: NextFunction) {
  let { authorization } = req.headers
  const token = authorization?.split(" ")[1]
  if (token) {
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.clearCookie("jwt").status(401).json({ msg: "Unauthorized" })
      } else {
        req.user = decoded
        next()
        return
      }
    })
  } else {
    return res.status(401).json({ msg: "Unauthorized" })
  }
}

/**
 * **Middleware to block users that don't have specific permissions**
 *
 * If user meets all the permissions it will continue to the next middleware
 *
 * @param {string[]} permissions List of permissions that user should have to access the resource
 *
 * @example
 * ```
 * app.get("/users", hasPermissions("PERMISSION1", "PERMISSION2"), (req, res) => {
 *   // access this only if req.user has all the permissions
 * })
 * ```
 */
export const hasPermissions = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req

    if (!user) {
      return res.status(401).json({
        msg: "You are not authenticated",
      })
    }

    for (let permission of permissions) {
      if (!user.permissions.find((p: Permission) => p.name === permission)) {
        return res.status(401).json({
          msg: "You don't have enough permissions to access this resource",
          requiredPermissions: permissions,
        })
      }
    }

    next()
    return
  }
}

/**
 * **Middleware to block users that don't have one of the roles**
 *
 * If user meets has one of the roles it will continue to the next middleware
 *
 * @param {string[]} roles List of roles that can access the resource
 *
 * @example
 * ```
 * app.get("/users", hasRoles("admin", "editor"), (req, res) => {
 *   // access this only if req.user has one of the roles (admin or editor)
 * })
 * ```
 */
export const hasRoles = (...roles: String[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req

    if (!user) {
      return res.status(401).json({
        msg: "You are not authenticated",
      })
    }

    let hasRole = false
    for (let role of roles) {
      if (user.role === role) {
        next()
        return
      }
    }

    return res.status(401).json({
      msg: "You are not authorized to access this resource",
      requiredRoles: roles,
    })
  }
}
