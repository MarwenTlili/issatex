import { VALIDATION } from "@/config/app";
import {
  CategoryTextileValues,
  FocusMarcheValues,
  TailleEntrepriseValues,
  TypeEntrepriseValues,
} from "@/types/resources/Client";
import { TAILLE_ARTICLE_OPTIONS } from "@/types/resources/TailleOrdreFabrication";
import { z } from "zod";

const USERNAME_REGEX = /^[a-z0-9_]+$/;

// Base schemas
const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "L'adresse e-mail est obligatoire" })
  .email({ message: "Veuillez entrer une adresse e-mail valide" });

// Article schemas
export const articleSchema = z.object({
  designation: z
    .string()
    .min(
      VALIDATION.MIN_LENGTH.DESIGNATION,
      `Désignation trop courte (min ${VALIDATION.MIN_LENGTH.DESIGNATION} caractères)`,
    )
    .max(
      VALIDATION.MAX_LENGTH.DESIGNATION,
      `Désignation trop longue (max ${VALIDATION.MAX_LENGTH.DESIGNATION} caractères)`,
    ),
  composition: z
    .string()
    .min(VALIDATION.MIN_LENGTH.COMPOSITION)
    .max(
      VALIDATION.MAX_LENGTH.COMPOSITION,
      `Composition trop longue (max ${VALIDATION.MAX_LENGTH.COMPOSITION} caractères)`,
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
      "Toutes les tailles doivent avoir une quantité supérieure à 0",
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
    heureDebut: z.string().nullable().optional(),
    heureFin: z.string().nullable().optional(),
    statut: z.enum(["Present", "Absent", "Retard", "Conge"], {
      required_error: "Le statut est requis",
    }),
    tempsPresence: z.string().nullable(),
    tempsPresenceText: z.string().optional(),
    employe: z.string().min(1, "L'employé est requis"),
    ilot: z.string(),
  })
  .refine(
    (data) =>
      ["Absent", "Conge"].includes(data.statut) ||
      (data.heureDebut && data.heureFin),
    {
      message:
        "L'heure de début et de fin sont requises pour les statuts Présent ou Retard.",
      path: ["heureDebut"], // attach to heureDebut input
    },
  );

// User schemas
export const userSchema = z.object({
  username: z
    .string()
    .min(
      VALIDATION.MIN_LENGTH.USERNAME,
      `Nom d'utilisateur trop court (min ${VALIDATION.MIN_LENGTH.USERNAME} caractères)`,
    )
    .max(
      VALIDATION.MAX_LENGTH.USERNAME,
      `Nom d'utilisateur trop long (max ${VALIDATION.MAX_LENGTH.USERNAME} caractères)`,
    )
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores (_)",
    ),
  email: emailSchema,
  // roles: z.array(z.string()).min(1, "Au moins un rôle requis"),
  // enabled: z.boolean().default(true),
});

// Password change schema with confirmation validation
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z
      .string()
      .min(
        VALIDATION.MIN_LENGTH.PASSWORD,
        `Nouveau mot de passe trop court (min ${VALIDATION.MIN_LENGTH.PASSWORD} caractères)`,
      ),
    confirmPassword: z.string().min(1, "Confirmation du mot de passe requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const createUserSchema = userSchema.extend({
  plainPassword: z
    .string()
    .min(
      VALIDATION.MIN_LENGTH.PASSWORD,
      `Mot de passe trop court (min ${VALIDATION.MIN_LENGTH.PASSWORD} caractères)`,
    ),
});

export const updateUserSchema = userSchema.partial().extend({
  id: z.string().min(1, "ID requis"),
});

// Login schema
export const loginFormSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;

// Registration schema
export const registrationFormSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { message: "Doit contenir au moins 3 caractères" })
    .max(30, { message: "Doit contenir au maximum 30 caractères" })
    .regex(USERNAME_REGEX, {
      message:
        "Le nom d'utilisateur ne peut contenir que des lettres minuscules, chiffres et underscores (_).",
    }),
  email: emailSchema,
  plainPassword: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  nom: z
    .string()
    .trim()
    .min(2, { message: "Le nom de l'entreprise est obligatoire" }),
  prenomResponsable: z
    .string()
    .trim()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  nomResponsable: z.string().trim().min(2, {
    message: "Le nom de famille doit contenir au moins 2 caractères",
  }),
  tailleEntreprise: z.enum(TailleEntrepriseValues, {
    errorMap: () => ({
      message: "Veuillez sélectionner la taille de l'entreprise",
    }),
  }),
  typeEntreprise: z.enum(TypeEntrepriseValues, {
    errorMap: () => ({ message: "Veuillez sélectionner le type d'entreprise" }),
  }),
  categoryTextile: z.enum(CategoryTextileValues, {
    errorMap: () => ({
      message: "Veuillez sélectionner une catégorie textile",
    }),
  }),
  adresse: z.string().trim().min(5, { message: "L'adresse est obligatoire" }),
  ville: z.string().trim().min(2, { message: "La ville est obligatoire" }),
  gouvernemental: z
    .string()
    .min(2, { message: "La région/province est obligatoire" }),
  codePostal: z
    .string()
    .trim()
    .min(3, { message: "Le code postal est obligatoire" }),
  pays: z.string().trim().min(2, { message: "Le pays est obligatoire" }),
  numeroTelephone: z
    .string()
    .trim()
    .min(5, { message: "Le numéro de téléphone est obligatoire" }),
  focusMarche: z
    .array(z.enum(FocusMarcheValues))
    .min(1, "Veuillez sélectionner au moins un marché cible"),
  informationsComplementaires: z.string().trim().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales d'utilisation",
  }),
});
export type RegistrationFormData = z.infer<typeof registrationFormSchema>;

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

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
