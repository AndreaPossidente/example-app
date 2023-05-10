import type { Request, Response } from "express"

import { Prisma } from "@prisma/client"
import prisma from "../../lib/prisma.js"

import dotenv from "dotenv"
dotenv.config()

/**
 * GET - Get all users
 */
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { role: { include: { permissions: true } } },
  })
  return res.status(200).json(users || [])
}

/**
 * GET - Get user by id
 */
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await prisma.user.findFirst({
    where: { id },
    include: { role: { include: { permissions: true } } },
  })
  return res.status(200).json(user || { msg: "user doesn't exists" })
}

/**
 * POST - Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
  const { username, password, role: roleInsert } = req.body

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
        role: roleInsert,
      },
    })
    return res.status(200).json(user)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ msg: "Username already in use" })
      }
    }
  }
}

/**
 * PUT - Update user by id
 */
export const updateUser = async (req: Request, res: Response) => {
  const { username, password, role: roleInsert } = req.body
  const { id } = req.params

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username: username || undefined,
        password: password || undefined,
        role: roleInsert ? { connect: { name: roleInsert } } : undefined,
      },
    })

    if (!user?.username) {
      return res.status(400).json(user)
    }
    return res.status(200).json(user)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code) {
        return res.status(400).json({ msg: e.meta?.cause })
      }
    }
  }
}

/**
 * DELETE - Delete user by id
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await prisma.user.delete({
    where: {
      id,
    },
  })

  if (!user?.username) {
    return res.status(400).json(user)
  }
  return res.status(200).json(user)
}
