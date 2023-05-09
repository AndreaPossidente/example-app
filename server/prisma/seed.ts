import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  await prisma.user.deleteMany()
  // create an admin user with credentials admin:admin
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "U2FsdGVkX1/4nSEWoTDvd2ph+W/Ztai2qWEHmnH63hA=", // admin
      role: "ADMIN",
      permissions: ["CAN_DELETE", "CAN_FETCH", "CAN_INSERT", "CAN_READ_PERSONAL_PROFILE", "CAN_UPDATE", "CAN_UPDATE_PERSONAL_PROFILE"],
    },
  })

  console.log(admin)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
