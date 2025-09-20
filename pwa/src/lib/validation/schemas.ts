import { VALIDATION } from "@/config/app";
import { TAILLE_ARTICLE_OPTIONS } from "@/types/resources/TailleOrdreFabrication";
import { z } from "zod";

// Base schemas
const emailSchema = z
  .string()
  .min(1, "Email requis")
  .max(
    VALIDATION.MAX_LENGTH.EMAIL,
    `Email trop long (max ${VALIDATION.MAX_LENGTH.EMAIL} caractères)`
  )
  .email("Format email invalide");

// Article schemas
export const articleSchema = z.object({
  designation: z
    .string()
    .min(
      VALIDATION.MIN_LENGTH.DESIGNATION,
      `Désignation trop courte (min ${VALIDATION.MIN_LENGTH.DESIGNATION} caractères)`
    )
    .max(
      VALIDATION.MAX_LENGTH.DESIGNATION,
      `Désignation trop longue (max ${VALIDATION.MAX_LENGTH.DESIGNATION} caractères)`
    ),
  composition: z
    .string()
    .min(VALIDATION.MIN_LENGTH.COMPOSITION)
    .max(
      VALIDATION.MAX_LENGTH.COMPOSITION,
      `Composition trop longue (max ${VALIDATION.MAX_LENGTH.COMPOSITION} caractères)`
    ),
});

export const createArticleSchema = articleSchema;

export const updateArticleSchema = articleSchema.partial().extend({
  id: z.number().positive(),
});

// Taille Article schema
export const tailleArticleSchema = z.enum(TAILLE_ARTICLE_OPTIONS);

// Taille Ordre Fabrication schema
export const tailleOrdreFabricationSchema = z.object({
  tailleArticle: tailleArticleSchema,
  quantite: z.number().min(1, "La quantité doit être supérieur à 0"),
});

// Ordre Fabrication schemas
export const ordreFabricationSchema = z.object({
  dateCloture: z
    .string()
    .min(1, "Date de clôture requise")
    .refine((date) => {
      const clotureDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return clotureDate > today;
    }, "La date de clôture doit être dans le futur"),
  urgent: z.boolean(),
  prixUnitaire: z
    .string()
    .min(1, "Prix unitaire requis")
    .refine((val) => {
      const num = Number.parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Le prix unitaire doit être supérieur à 0"),
  tempsUnitaire: z.number().min(1, "Le temps unitaire doit être supérieur à 0"),
  article: z.string().min(1, "Article requis"),
  tailleOFs: z
    .array(tailleOrdreFabricationSchema)
    .min(1, "Au moins une configuration de taille est requise")
    .refine(
      (tailleOFs) => tailleOFs.every((taille) => taille.quantite > 0),
      "Toutes les tailles doivent avoir une quantité supérieure à 0"
    ),
});

export const createOrdreFabricationSchema = ordreFabricationSchema;

export const updateOrdreFabricationSchema = ordreFabricationSchema
  .partial()
  .extend({
    id: z.number().positive(),
  });

// Production schemas
export const productionSchema = z.object({
  dateProduction: z
    .string()
    .min(1, "Date de production requise")
    .refine((date) => {
      const productionDate = new Date(date);
      return !isNaN(productionDate.getTime());
    }, "Date de production invalide"),
  tailleArticle: tailleArticleSchema,
  quantitePremiereChoix: z
    .number()
    .min(0, "La quantité 1er choix doit être positive"),
  quantiteDeuxiemeChoix: z
    .number()
    .min(0, "La quantité 2ème choix doit être positive"),
  quantiteTotale: z.number().min(0, "La quantité totale doit être positive"),
});

export const createProductionSchema = productionSchema.extend({
  planning: z.string().min(1, "Planning requis"),
});

export const updateProductionSchema = productionSchema.partial().extend({
  id: z.string().min(1, "ID requis"),
});

export const presenceSchema = z
  .object({
    datePresence: z
      .string()
      .min(1, "La date de présence est requise")
      .refine((date) => !isNaN(Date.parse(date)), "Format de date invalide"),
    heureDebut: z
      .string()
      .min(1, "L'heure de début est requise")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Format d'heure invalide (HH:MM)"
      ),
    heureFin: z
      .string()
      .min(1, "L'heure de fin est requise")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Format d'heure invalide (HH:MM)"
      ),
    statut: z.enum(["Present", "Absent", "Retard", "Conge"], {
      required_error: "Le statut est requis",
    }),
    tempsPresence: z
      .number()
      .min(0, "Le temps de présence doit être positif")
      .max(24, "Le temps de présence ne peut pas dépasser 24 heures"),
    employe: z.string().min(1, "L'employé est requis"),
    ilot: z.string().optional(),
  })
  .refine(
    (data) => {
      const debut = new Date(`1970-01-01T${data.heureDebut}:00`);
      const fin = new Date(`1970-01-01T${data.heureFin}:00`);
      return fin > debut;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ["heureFin"],
    }
  );

// User schemas
export const userSchema = z.object({
  username: z
    .string()
    .min(
      VALIDATION.MIN_LENGTH.USERNAME,
      `Nom d'utilisateur trop court (min ${VALIDATION.MIN_LENGTH.USERNAME} caractères)`
    )
    .max(
      VALIDATION.MAX_LENGTH.USERNAME,
      `Nom d'utilisateur trop long (max ${VALIDATION.MAX_LENGTH.USERNAME} caractères)`
    ),
  email: emailSchema,
  roles: z.array(z.string()).min(1, "Au moins un rôle requis"),
  enabled: z.boolean().default(true),
});

export const createUserSchema = userSchema.extend({
  plainPassword: z
    .string()
    .min(
      VALIDATION.MIN_LENGTH.PASSWORD,
      `Mot de passe trop court (min ${VALIDATION.MIN_LENGTH.PASSWORD} caractères)`
    ),
});

export const updateUserSchema = userSchema.partial().extend({
  id: z.string().min(1, "ID requis"),
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

// Type exports
export type ArticleFormData = z.infer<typeof articleSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

export type TailleOrdreFabricationFormData = z.infer<
  typeof tailleOrdreFabricationSchema
>;

export type OrdreFabricationFormData = z.infer<typeof ordreFabricationSchema>;
export type CreateOrdreFabricationInput = z.infer<
  typeof createOrdreFabricationSchema
>;
export type UpdateOrdreFabricationInput = z.infer<
  typeof updateOrdreFabricationSchema
>;

export type ProductionFormData = z.infer<typeof productionSchema>;
export type CreateProductionInput = z.infer<typeof createProductionSchema>;
export type UpdateProductionInput = z.infer<typeof updateProductionSchema>;

export type PresenceFormData = z.infer<typeof presenceSchema>;

export type UserFormData = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
