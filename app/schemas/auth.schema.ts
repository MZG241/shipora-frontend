import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Le mot de passe est requis"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Le nom doit contenir au moins 2 caractères",
    )
    .max(
      150,
      "Le nom est trop long",
    ),

  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .toLowerCase(),

  password: z
    .string()
    .min(
      8,
      "Le mot de passe doit contenir au moins 8 caractères",
    )
    .max(
      100,
      "Le mot de passe est trop long",
    ),

  organizationName: z
    .string()
    .trim()
    .min(
      2,
      "Le nom de l'entreprise doit contenir au moins 2 caractères",
    )
    .max(
      150,
      "Le nom de l'entreprise est trop long",
    ),
});

export type LoginFormData = z.infer<
  typeof loginSchema
>;

export type RegisterFormData = z.infer<
  typeof registerSchema
>;

