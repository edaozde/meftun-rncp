import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@meftun.com' },
    update: {},
    create: {
      email: 'admin@meftun.com',
      password: hashedPassword,
      role: Role.SUPERADMIN,
      acceptedPrivacyPolicy: true,
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
