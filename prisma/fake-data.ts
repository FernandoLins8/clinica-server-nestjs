import { PrismaClient } from ".prisma/client"

const prisma = new PrismaClient();

async function main() {
  await prisma.service.create({
    data: {
      name: "Limpeza de pele",
      duration: 30,
      value: 80,
    },
  });

  await prisma.service.create({
    data: {
      name: "Massagem",
      duration: 60,
      value: 120,
    },
  });

  await prisma.service.create({
    data: {
      name: "Depilação",
      duration: 45,
      value: 60,
    },
  });

  await prisma.service.create({
    data: {
      name: "Manicure",
      duration: 30,
      value: 40,
    },
  });

  await prisma.professional.create({
    data: {
      name: "Ana",
      commission: 0.2,
    },
  });

  await prisma.professional.create({
    data: {
      name: "Carlos",
      commission: 0.25,
    },
  });

  await prisma.professional.create({
    data: {
      name: "Beatriz",
      commission: 0.15,
    },
  });

  await prisma.professional.create({
    data: {
      name: "João",
      commission: 0.30,
    },
  });
}

main()
