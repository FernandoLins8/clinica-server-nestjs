import { PrismaClient } from ".prisma/client"
import { hash } from 'bcrypt'

const prisma = new PrismaClient();

async function main() {

  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD;
  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    },
  });
}

main()
