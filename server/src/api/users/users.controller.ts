import type { Request, Response } from "express"

import { Prisma } from "@prisma/client"
import prisma from "../../lib/prisma.js"

import dotenv from "dotenv"
dotenv.config()

import { hasPermission, isAdmin } from "../../utils/hasPermission.js"

/**
 * GET - Get all users
 */
export const getUsers = async (req: Request, res: Response) => {
  const { user } = req

  if (!user) {
    return res.status(401).json({
      msg: "You are not authenticated",
    })
  }

  const { role, permissions } = user

  if (!isAdmin(role)) {
    return res.status(401).json({
      msg: "Only admins are authorized",
    })
  }

  if (!hasPermission("CAN_FETCH", permissions)) {
    return res.status(401).json({
      msg: "Only admins with CAN_FETCH permission can perform this request",
    })
  }

  const usr = await prisma.user.findMany({ include: { role: { include: { permissions: true } } } }) // SELECT * FROM users

  return res.status(200).json(usr || [])
}

/**
 * GET - Get user by id
 */
export const getUser = async (req: Request, res: Response) => {
  const { user } = req
  const { id } = req.params

  if (!user) {
    return res.status(401).json({
      msg: "You are not authenticated",
    })
  }

  const { role, permissions } = user

  if (!isAdmin(role)) {
    return res.status(401).json({
      msg: "Only admins are authorized",
    })
  }

  if (!hasPermission("CAN_FETCH", permissions)) {
    return res.status(401).json({
      msg: "Only admins with CAN_FETCH permission can perform this request",
    })
  }

  const usr = await prisma.user.findFirst({ where: { id }, include: { role: { include: { permissions: true } } } }) // SELECT * FROM users

  return res.status(200).json(usr || { msg: "user doesn't exists" })
}

/**
 * POST - Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
  const { username, password, role: roleInsert } = req.body
  const { user } = req

  if (!user) {
    return res.status(401).json({
      msg: "You are not authenticated",
    })
  }

  const { role, permissions } = user

  if (!isAdmin(role)) {
    return res.status(401).json({
      msg: "Only admins are authorized",
    })
  }

  if (!hasPermission("CAN_INSERT", permissions)) {
    return res.status(401).json({
      msg: "Only admins with CAN_INSERT permission can perform this request",
    })
  }
  try {
    const usr = await prisma.user.create({
      data: {
        username,
        password,
        role: roleInsert,
      },
    })
    return res.status(200).json(usr)
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
  const { user } = req

  if (!user) {
    return res.status(401).json({
      msg: "You are not authenticated",
    })
  }

  const { role, permissions } = user

  if (!isAdmin(role)) {
    return res.status(401).json({
      msg: "Only admins are authorized",
    })
  }

  if (!hasPermission("CAN_UPDATE", permissions)) {
    return res.status(401).json({
      msg: "Only admins with CAN_UPDATE permission can perform this request",
    })
  }

  try {
    const usr = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username: username || undefined,
        password: password || undefined,
        role: roleInsert ? { connect: { name: roleInsert } } : undefined,
      },
    })

    if (!usr?.username) {
      return res.status(400).json(usr)
    }
    return res.status(200).json(usr)
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
  const { user } = req

  if (!user) {
    return res.status(401).json({
      msg: "You are not authenticated",
    })
  }

  const { role, permissions } = user

  if (!isAdmin(role)) {
    return res.status(401).json({
      msg: "Only admins are authorized",
    })
  }

  if (!hasPermission("CAN_DELETE", permissions)) {
    return res.status(401).json({
      msg: "Only admins with CAN_DELETE permission can perform this request",
    })
  }

  const usr = await prisma.user.delete({
    where: {
      id,
    },
  }) // SELECT * FROM users

  if (!usr?.username) {
    return res.status(400).json(usr)
  }
  return res.status(200).json(usr)
}
