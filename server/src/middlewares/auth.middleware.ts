import type { Request, Response, NextFunction } from "express"
import type { Permission, Role } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const { SECRET = "" } = process.env

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
