import type { Request, Response } from "express"

import { Prisma } from "@prisma/client"
import prisma from "@lib/prisma.js"

import dotenv from "dotenv"
dotenv.config()

/**
 * GET - Get all roles
 */
const getRoles = async (req: Request, res: Response) => {
  const roles = await prisma.role.findMany({
    include: { permissions: true },
  })
  return res.status(200).json(roles || [])
}

/**
 * GET - Get role by id
 */
const getRole = async (req: Request, res: Response) => {
  const { name } = req.params
  const role = await prisma.role.findFirst({
    where: { name },
    include: { permissions: true },
  })
  return res.status(200).json(role || { msg: "role doesn't exists" })
}

/**
 * POST - Create a new role
 */
const createRole = async (req: Request, res: Response) => {
  const { name, permissions, users } = req.body

  try {
    const role = await prisma.role.create({
      data: {
        name: name,
        permissions: {
          connect: permissions || undefined,
        },
        users: {
          connect: users || undefined,
        },
      },
      include: { permissions: true },
    })
    return res.status(200).json(role)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ msg: "Role already in use" })
      }
    }
  }
}

/**
 * PUT - Update role by id
 */
const updateRole = async (req: Request, res: Response) => {
  const { name, permissions, users } = req.body
  const { id } = req.params

  try {
    const role = await prisma.role.update({
      where: {
        name,
      },
      data: {
        name: name || undefined,
        permissions: permissions ? { connect: permissions } : undefined,
        users: users ? { connect: users } : undefined,
      },
      include: { permissions: true },
    })

    if (!role?.name) {
      return res.status(400).json(role)
    }
    return res.status(200).json(role)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code) {
        return res.status(400).json({ msg: e.meta?.cause })
      }
    }
  }
}

/**
 * DELETE - Delete role by id
 */
const deleteRole = async (req: Request, res: Response) => {
  const { name } = req.params

  const role = await prisma.role.delete({
    where: {
      name,
    },
  })

  if (!role?.name) {
    return res.status(400).json(role)
  }
  return res.status(200).json(role)
}

export default { getRoles, getRole, createRole, updateRole, deleteRole }
