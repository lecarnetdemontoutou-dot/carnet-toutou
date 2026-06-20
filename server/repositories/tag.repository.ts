import { prisma } from "@/lib/db/client";
import type { TagStatus } from "@prisma/client";

export const tagRepository = {
  findByTagCode(tagCode: string) {
    return prisma.tag.findUnique({
      where: { tagCode },
      include: {
        pet: {
          include: { publicSettings: true },
        },
      },
    });
  },

  findByActivationCode(activationCode: string) {
    return prisma.tag.findUnique({ where: { activationCode } });
  },

  findManyByUser(userId: string) {
    return prisma.tag.findMany({
      where: { userId },
      include: { pet: true },
      orderBy: { createdAt: "desc" },
    });
  },

  activate(params: {
    tagId: string;
    userId: string;
    petId: string;
  }) {
    return prisma.tag.update({
      where: { id: params.tagId },
      data: {
        userId: params.userId,
        petId: params.petId,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });
  },

  setStatus(tagId: string, status: TagStatus) {
    return prisma.tag.update({
      where: { id: tagId },
      data: { status },
    });
  },

  // Utilisé par l'admin pour générer un lot de médailles avant activation
  createUnassigned(params: { tagCode: string; activationCode: string }) {
    return prisma.tag.create({
      data: {
        tagCode: params.tagCode,
        activationCode: params.activationCode,
        status: "UNASSIGNED",
      },
    });
  },
};
