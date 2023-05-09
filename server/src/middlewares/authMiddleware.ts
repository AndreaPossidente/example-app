import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const { SECRET = "" } = process.env

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  let { authorization } = req.headers
  const token = authorization?.split(" ")[1]
  if (token) {
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        res.clearCookie("jwt")
        res.status(401).json({ message: "Unauthorized" })
      } else {
        // @ts-ignore
        req.user = decoded
        next()
      }
    })
  } else {
    res.status(401).json({ message: "Unauthorized" })
  }
}
