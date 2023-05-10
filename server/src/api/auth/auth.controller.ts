import type { Request, Response } from "express"

import { Prisma } from "@prisma/client"
import prisma from "../../lib/prisma.js"

import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config()

const { SECRET = "" } = process.env

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      msg: "Must insert username and password",
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: { role: { include: { permissions: true } } },
  })

  if (user) {
    const pass = CryptoJS.AES.decrypt(user.password, SECRET).toString(CryptoJS.enc.Utf8)

    if (password === pass) {
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.roleName,
          permissions: user.role.permissions,
        },
        SECRET
      )

      return res
        .cookie("jwt", token, {
          // httpOnly: true,
          // secure: true,
        })
        .status(200)
        .json({
          token,
        })
    } else {
      return res.status(401).json({
        msg: "Unauthorized wrong password",
      })
    }
  } else {
    return res.status(401).json({
      msg: "Unauthorized wrong username",
    })
  }
}

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      msg: "Must insert username and password",
    })
  }

  const hashedPassword = CryptoJS.AES.encrypt(password, SECRET).toString()

  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        role: {
          connectOrCreate: {
            where: { name: "user" },
            create: {
              name: "user",
              permissions: {
                connectOrCreate: [
                  {
                    where: { name: "CAN_READ_PERSONAL_PROFILE" },
                    create: { name: "CAN_READ_PERSONAL_PROFILE", description: "Can view his profile info" },
                  },
                  {
                    where: { name: "CAN_UPDATE_PERSONAL_PROFILE" },
                    create: { name: "CAN_UPDATE_PERSONAL_PROFILE", description: "Can update his profile info" },
                  },
                ],
              },
            },
          },
        },
      },
      include: { role: { include: { permissions: true } } },
    })

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.roleName,
        permissions: user.role.permissions,
      },
      SECRET
    )
    return res
      .cookie("jwt", token, {
        // httpOnly: true,
        // secure: true,
      })
      .status(200)
      .json({
        msg: "user created",
        token,
      })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ msg: "There is a unique constraint violation, a new user cannot be created with this username" })
      }
    }
  }
}
