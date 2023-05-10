import type { Permission } from "@prisma/client"

export function hasPermission(permission: string, permissions: Permission[]) {
  if (permissions.find((p: Permission) => p.name === permission)) {
    return true
  }
  return false
}

export function isAdmin(role: string) {
  if (role !== "admin") {
    return false
  }
  return true
}
