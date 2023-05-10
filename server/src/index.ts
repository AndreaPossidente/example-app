import express from "express"
import "express-async-errors"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config()

import authRouter from "./api/auth/auth.router.js"
import usersRouter from "./api/users/users.router.js"

const { SERVER_PORT } = process.env

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

app.use("/api/auth", authRouter)
app.use("/api", usersRouter)

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${SERVER_PORT}`)
})
