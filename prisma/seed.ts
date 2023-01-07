import { PrismaClient } from ".prisma/client"
import { hash } from 'bcrypt'

const prisma = new PrismaClient();

async function main() {

  const password = process.env.ADMIN_PASSWORD;
  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@clinica.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
}

main()
