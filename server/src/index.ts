import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const { SERVER_PORT } = process.env;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany(); // SELECT * FROM users

  res.status(200).json(users);
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  res.status(200).json({ msg: "user created" });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${SERVER_PORT}`);
});
