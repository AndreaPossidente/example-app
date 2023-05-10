import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  await prisma.permission.deleteMany()
  await prisma.role.deleteMany()
  await prisma.user.deleteMany()
  // create an admin user with credentials admin:admin
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "U2FsdGVkX1/4nSEWoTDvd2ph+W/Ztai2qWEHmnH63hA=", // admin
      role: {
        connectOrCreate: {
          where: { name: "admin" },
          create: {
            name: "admin",
            permissions: {
              connectOrCreate: [
                {
                  where: { name: "CAN_INSERT" },
                  create: { name: "CAN_INSERT", description: "Can insert data at any endpoint" },
                },
                {
                  where: { name: "CAN_UPDATE" },
                  create: { name: "CAN_UPDATE", description: "Can update data at any endpoint" },
                },
                {
                  where: { name: "CAN_FETCH" },
                  create: { name: "CAN_FETCH", description: "Can get data at any endpoint" },
                },
                {
                  where: { name: "CAN_DELETE" },
                  create: { name: "CAN_DELETE", description: "Can delete data at any endpoint" },
                },
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
