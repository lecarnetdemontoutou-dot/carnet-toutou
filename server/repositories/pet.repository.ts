import { prisma } from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

export const petRepository = {
  findById(id: string) {
    return prisma.pet.findUnique({
      where: { id },
      include: { publicSettings: true, tags: true },
    });
  },

  findManyByUser(userId: string) {
    return prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(userId: string, data: Prisma.PetCreateWithoutUserInput) {
    return prisma.pet.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
        publicSettings: { create: {} }, // valeurs par défaut sûres (cf. schéma)
      },
    });
  },

  update(petId: string, data: Prisma.PetUpdateInput) {
    return prisma.pet.update({ where: { id: petId }, data });
  },

  setLostStatus(petId: string, isLost: boolean) {
    return prisma.pet.update({
      where: { id: petId },
      data: {
        isLost,
        lostSince: isLost ? new Date() : null,
      },
    });
  },
};
