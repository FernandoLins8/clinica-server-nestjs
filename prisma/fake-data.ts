import { PrismaClient } from ".prisma/client"

const prisma = new PrismaClient();

async function main() {
  await prisma.service.create({
    data: {
      name: "Limpeza de pele",
      duration: 30,
      value: 80,
      description: 'Transforme a sua pele com nossa Limpeza de Pele! Com uma técnica avançada, nossos profissionais irão remover impurezas e cravos, deixando sua pele mais saudável e revitalizada. Dê adeus ao excesso de oleosidade e borbulhas e dê as boas-vindas a uma pele radiante e macia.'
    },
  });

  await prisma.service.create({
    data: {
      name: "Massagem",
      duration: 60,
      value: 120,
      description: 'Alcance o equilíbrio completo com nossa massagem relaxante. Com técnicas suaves e personalizadas, nossos profissionais irão ajudá-lo a aliviar o estresse, a dor e a tensão acumulada. Escolha entre uma variedade de opções, incluindo massagem sueca, massagem profunda e massagem com pedras quentes. Faça sua reserva agora e experimente a sensação de relaxamento e bem-estar.'
    },
  });

  await prisma.service.create({
    data: {
      name: "Depilação",
      duration: 45,
      value: 60,
      description: 'Obtenha uma pele lisa e suave com nossa depilação profissional. Com técnicas precisas e indolores, nossos profissionais irão remover os pelos indesejados de forma segura e eficiente. Escolha entre cera quente ou fria, depilação com linha ou com lâmina. Faça sua reserva agora e experimente a sensação de conforto e satisfação.'
    },
  });

  await prisma.service.create({
    data: {
      name: "Manicure",
      duration: 30,
      value: 40,
      description: 'Dê às suas mãos o cuidado que elas merecem com nossos serviços de manicure. Com uma variedade de opções de esmaltes e técnicas de limpeza, nossos profissionais irão deixar suas mãos macias, hidratadas e com unhas fortes e bem cuidadas.'
    },
  });

  await prisma.professional.create({
    data: {
      name: "Ana Smith",
      commission: 0.2,
      description: 'Ana é uma profissional experiente em massagem. Ela possui habilidades excepcionais em técnicas de massagem sueca e massagem com pedras quentes, proporcionando aos seus clientes um relaxamento profundo e alívio da dor. Ana é uma escuta atenta e sempre busca entender as necessidades de seus clientes para personalizar suas sessões.'
    },
  });

  await prisma.professional.create({
    data: {
      name: "Carlos Dias",
      commission: 0.3,
      description: 'Carlos é um especialista em depilação. Ele possui habilidades incríveis com cera quente e fria, proporcionando aos seus clientes uma depilação precisa e indolor.'
    },
  });

  await prisma.professional.create({
    data: {
      name: "Beatriz Evans",
      commission: 0.25,
      description: 'Beatriz é uma especialista em manicure. Ela possui habilidades incríveis em técnicas de esmaltação, proporcionando aos seus clientes unhas fortes e bem cuidadas. Beatriz é muito criativa e sempre tem ótimas sugestões de design de unhas para seus clientes.'
    },
  });

  await prisma.professional.create({
    data: {
      name: "John Williams",
      commission: 0.15,
      description: 'John é um profissional multifacetado, especializado em vários serviços, como massagem, depilação e manicure. Ele possui habilidades excepcionais em técnicas de massagem profunda, depilação com linha e esmaltação. João é muito atencioso e sempre busca entender as necessidades de seus clientes para personalizar suas sessões.'
    },
  });
}

main()
