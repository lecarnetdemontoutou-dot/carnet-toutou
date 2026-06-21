import { z } from "zod";

export const activationSchema = z.object({
  activationCode: z
    .string()
    .trim()
    .min(6, "Le code d'activation est trop court.")
    .max(20, "Le code d'activation est trop long."),
  petId: z.string().optional(), // si l'utilisateur choisit un chien existant
});

export const petFormSchema = z.object({
  name: z.string().trim().min(1, "Le prénom du chien est obligatoire."),
  breed: z.string().trim().optional(),
  birthDate: z.string().optional(), // saisi en ISO depuis un <input type="date">
  sex: z.enum(["MALE", "FEMALE", "UNKNOWN"]).default("UNKNOWN"),
  weightKg: z.coerce.number().positive().optional(),
  photoUrl: z.string().url().optional(),
  description: z.string().trim().optional(),
  publicMessage: z.string().trim().max(280).optional(),
  emergencyPhone: z.string().trim().optional(),
  secondaryPhone: z.string().trim().optional(),
  contactEmail: z.string().email().optional(),
  address: z.string().trim().optional(),
  vetName: z.string().trim().optional(),
  vetPhone: z.string().trim().optional(),
  medicalNotes: z.string().trim().optional(),
  behaviorNotes: z.string().trim().optional(),
  distinctiveFeatures: z.string().trim().optional(),
  emergencyInstructions: z.string().trim().optional(),
});

export const foundReportSchema = z.object({
  tagCode: z.string().trim().min(1),
  finderName: z.string().trim().min(1, "Merci d'indiquer votre prénom."),
  finderPhone: z
    .string()
    .trim()
    .min(6, "Merci d'indiquer un numéro de téléphone valide."),
  message: z.string().trim().max(500).optional(),
  locationText: z.string().trim().max(200).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // Anti-spam minimal : champ honeypot, doit rester vide
  website: z.string().max(0).optional(),
});

