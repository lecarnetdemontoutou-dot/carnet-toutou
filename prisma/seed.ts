import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { customAlphabet } from "nanoid";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const codeAlphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const tagCodeId = customAlphabet(codeAlphabet, 8);
const activationCodeId = customAlphabet(codeAlphabet, 6);

async function main() {
  console.log("Nettoyage des données existantes…");
  await prisma.foundReport.deleteMany();
  await prisma.scanEvent.deleteMany();
  await prisma.publicProfileSettings.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Création d'un utilisateur de démo…");
  const user = await prisma.user.create({
    data: {
      firstName: "Camille",
      lastName: "Durand",
      email: "demo@lecarnetdemontoutou.com",
      role: "ADMIN", // compte de démo avec accès admin pour explorer le back-office
    },
  });

  console.log("Création d'un chien de démo…");
  const pet = await prisma.pet.create({
    data: {
      userId: user.id,
      name: "Filou",
      breed: "Jack Russell",
      sex: "MALE",
      weightKg: 6.5,
      publicMessage: "Je suis très gentil, j'ai juste eu peur du feu d'artifice 🎆",
      emergencyPhone: "+33612345678",
      vetName: "Clinique vétérinaire du Parc",
      vetPhone: "+33198765432",
      medicalNotes: "Allergique à la pénicilline.",
      behaviorNotes: "Un peu craintif avec les inconnus, ne pas le forcer à venir.",
      emergencyInstructions: "Garder en laisse, ne pas le laisser approcher la route.",
      publicSettings: {
        create: {
          showEmergencyPhone: true,
          showMedicalNotes: true,
          showBehaviorNotes: true,
          showLostStatus: true,
        },
      },
    },
  });

  console.log("Création d'une médaille active reliée à Filou…");
  await prisma.tag.create({
    data: {
      tagCode: tagCodeId(),
      activationCode: `ACT-${activationCodeId()}`,
      status: "ACTIVE",
      userId: user.id,
      petId: pet.id,
      activatedAt: new Date(),
    },
  });

  console.log("Création de 5 médailles vierges, prêtes à activer…");
  for (let i = 0; i < 5; i++) {
    await prisma.tag.create({
      data: {
        tagCode: tagCodeId(),
        activationCode: `ACT-${activationCodeId()}`,
        status: "UNASSIGNED",
      },
    });
  }

  const demoTag = await prisma.tag.findFirst({ where: { petId: pet.id } });
  console.log("\n✅ Données de démo créées.");
  console.log(`   Page publique de scan : /t/${demoTag?.tagCode}`);
  console.log(`   Compte de démo (à connecter via /register avec cet email) : ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
