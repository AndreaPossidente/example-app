import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const prisma = new PrismaClient();

dotenv.config();

const { SERVER_PORT, SECRET = "" } = process.env;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/users", authMiddleware, async (req, res) => {
  // @ts-ignore
  const { user } = req;

  const usr = await prisma.user.findFirst({
    where: {
      id: user.userId,
    },
  }); // SELECT * FROM users

  res.status(200).json(usr);
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = CryptoJS.AES.encrypt(password, SECRET).toString();

  await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  res.status(200).json({ msg: "user created" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (user) {
    const pass = CryptoJS.AES.decrypt(user.password, SECRET).toString(
      CryptoJS.enc.Utf8
    );

    console.log(pass);

    if (password === pass) {
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        SECRET
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Unauthorized wrong password" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized wrong username" });
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${SERVER_PORT}`);
});
