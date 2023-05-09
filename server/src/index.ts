import express from "express"
import "express-async-errors"
import morgan from "morgan"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import jwt from "jsonwebtoken"
import CryptoJS from "crypto-js"

import { PrismaClient } from "@prisma/client"
import { authMiddleware } from "./middlewares/authMiddleware.js"

const prisma = new PrismaClient()

dotenv.config()

const { SERVER_PORT, SECRET = "" } = process.env

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))

interface User {
  userId: number;
  username: string;
  role: string;
  permissions: string[];
}
app.get("/users", authMiddleware, async (req, res) => {
  // @ts-ignore
  const {
    user,
  }: {
    user: User,
  } = req
  const { role, permissions } = user

  if (role !== "ADMIN") {
    res.status(401).json({
      msg: "Only admins are authorized",
    })
    return
  }

  if (!permissions.find((p) => p === "CAN_FETCH")) {
    res.status(401).json({
      msg: "Only admins with CAN_FETCH permission can perform this request",
    })
    return
  }

  const usr = await prisma.user.findMany({}) // SELECT * FROM users

  res.status(200).json(usr)
})

app.post("/users", authMiddleware, async (req, res) => {
  const { username, password, role: roleInsert, permissions: permissionsInsert } = req.body
  // @ts-ignore
  const {
    user,
  }: {
    user: User,
  } = req
  const { role, permissions } = user

  if (role !== "ADMIN") {
    res.status(401).json({
      msg: "Only admins are authorized",
    })
    return
  }

  if (!permissions.find((p) => p === "CAN_INSERT")) {
    res.status(401).json({
      msg: "Only admins with CAN_INSERT permission can perform this request",
    })
    return
  }

  const usr = await prisma.user.create({
    data: {
      username,
      password,
      role: roleInsert,
      permissions: permissionsInsert,
    },
  }) // SELECT * FROM users

  res.status(200).json(usr)
})

app.put("/users", authMiddleware, async (req, res) => {
  const { username, password, role: roleInsert, permissions: permissionsInsert } = req.body
  // @ts-ignore
  const {
    user,
  }: {
    user: User,
  } = req
  const { role, permissions } = user

  if (role !== "ADMIN") {
    res.status(401).json({
      msg: "Only admins are authorized",
    })
    return
  }

  if (!permissions.find((p) => p === "CAN_UPDATE")) {
    res.status(401).json({
      msg: "Only admins with CAN_UPDATE permission can perform this request",
    })
    return
  }

  const usr = await prisma.user.update({
    where: {
      username,
    },
    data: {
      username,
      password,
      role: roleInsert,
      permissions: permissionsInsert,
    },
  }) // SELECT * FROM users
  if (!usr?.username) {
    res.status(400).json(usr)
    return
  }
  res.status(200).json(usr)
})

app.delete("/users", authMiddleware, async (req, res) => {
  const { username } = req.body
  // @ts-ignore
  const {
    user,
  }: {
    user: User,
  } = req
  const { role, permissions } = user

  if (role !== "ADMIN") {
    res.status(401).json({
      msg: "Only admins are authorized",
    })
    return
  }

  if (!permissions.find((p) => p === "CAN_DELETE")) {
    res.status(401).json({
      msg: "Only admins with CAN_DELETE permission can perform this request",
    })
    return
  }

  const usr = await prisma.user.delete({
    where: {
      username,
    },
  }) // SELECT * FROM users

  if (!usr?.username) {
    res.status(400).json(usr)
    return
  }
  res.status(200).json(usr)
})

app.post("/signup", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({
      msg: "Must insert username and password",
    })
    return
  }
  /* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWF0dGVvIiwicm9sZSI6IlVTRVIiLCJwZXJtaXNzaW9ucyI6WyJDQU5fUkVBRF9QRVJTT05BTF9QUk9GSUxFIiwiQ0FOX1VQREFURV9QRVJTT05BTF9QUk9GSUxFIl0sImlhdCI6MTY4MzY0NTU1N30.5ntHNeMBZ8coPqbQIYTwni6vEqrJagUdel0lHe3eN9I */
  const hashedPassword = CryptoJS.AES.encrypt(password, SECRET).toString()

  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  })
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    },
    SECRET
  )
  res.cookie("jwt", token, {
    // httpOnly: true,
    // secure: true,
  })

  res.status(200).json({
    msg: "user created",
    token,
  })
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({
      msg: "Must insert username and password",
    })
    return
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (user) {
    const pass = CryptoJS.AES.decrypt(user.password, SECRET).toString(CryptoJS.enc.Utf8)

    console.log(pass)

    if (password === pass) {
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions,
        },
        SECRET
      )

      res.cookie("jwt", token, {
        // httpOnly: true,
        // secure: true,
      })

      res.status(200).json({
        token,
      })
    } else {
      res.status(401).json({
        message: "Unauthorized wrong password",
      })
    }
  } else {
    res.status(401).json({
      message: "Unauthorized wrong username",
    })
  }
})

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${SERVER_PORT}`)
})
