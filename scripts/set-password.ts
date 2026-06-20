import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      phone: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "USER" },
    },
  },
});

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Utilisateur introuvable : ${email}`);

  const { hashPassword } = await import("@better-auth/utils/password");
  const hashed = await hashPassword(password);

  await prisma.account.upsert({
    where: { providerId_accountId: { providerId: "credential", accountId: user.id } },
    create: { providerId: "credential", accountId: user.id, userId: user.id, password: hashed },
    update: { password: hashed },
  });

  console.log(`✅ Mot de passe défini pour ${email}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
