"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryIcon as Fabric } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  CategoryTextileValues,
  FocusMarcheValues,
  TailleEntrepriseValues,
  TypeEntrepriseValues,
} from "@/types/resources/Client";
import { useRegisterClient } from "@/hooks/use-register-client";
import {
  RegistrationFormData,
  registrationFormSchema,
} from "@/lib/validation/schemas";
import { handleFormSubmitError } from "@/lib/api/handle-api-error";
import { TermsOfUseModal } from "@/components/modals/terms-of-use";
import { PrivacyPolicyModal } from "@/components/modals/privacy-policy";
import { RHFInput } from "@/components/form/RHFInput";
import { RHFSelect } from "@/components/form/RHFSelect";
import { RHFRadioGroup } from "@/components/form/RHFRadioGroup";
import { RHFCheckboxGroup } from "@/components/form/RHFCheckboxGroup";

export function ClientRegistrationForm() {
  const registration = useRegisterClient();
  const router = useRouter();
  const [termsOfUseModalOpen, setTermsOfUseModalOpen] = useState(false);
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    shouldFocusError: true,
    defaultValues: {
      termsAccepted: false,
      focusMarche: [],
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const response = await registration.mutateAsync(data);
      toast.success(response.message);
      router.replace("/login");
    } catch (error) {
      handleFormSubmitError<RegistrationFormData>(error, setError);
    }
  };

  return (
    <>
      <Card className="border shadow-xl overflow-hidden max-w-4xl mx-auto">
        <CardHeader className="bg-white border-b p-6">
          <div className="flex items-center gap-2">
            <Fabric className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-bold">Issatex - Inscription</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Veuillez remplir le formulaire ci-dessous pour créer votre compte
            entreprise.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form
            id="registrationForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Section 1: Informations sur le compte */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-amber-600">
                Informations sur le compte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RHFInput
                  label="Adresse E-mail"
                  name="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  autoComplete="email"
                  register={register}
                  error={errors.email}
                  required
                />

                <RHFInput
                  label="Nom d'utilisateur"
                  name="username"
                  type="text"
                  placeholder="votre nom d'utilisateur"
                  autoComplete="username"
                  register={register}
                  helperText="lettres minuscules, chiffres et underscores (_)"
                  error={errors.username}
                  required
                />

                <RHFInput
                  label="Mot de passe"
                  name="plainPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Créez un mot de passe"
                  register={register}
                  error={errors.plainPassword}
                  required
                />
              </div>
            </div>

            {/* Section 2: Détails de l'entreprise */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-amber-600">
                {"Détails de l'entreprise"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInput
                  label="Prénom Responsable"
                  name="prenomResponsable"
                  type="text"
                  autoComplete="prenomResponsable"
                  placeholder="saisissez votre prénom"
                  register={register}
                  error={errors.prenomResponsable}
                  required
                />

                <RHFInput
                  label="Nom Responsable"
                  name="nomResponsable"
                  type="text"
                  autoComplete="nomResponsable"
                  placeholder="saisissez votre nom"
                  register={register}
                  error={errors.nomResponsable}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RHFInput
                  label="Nom de l'entreprise"
                  name="nom"
                  type="text"
                  autoComplete="nom"
                  placeholder="nom de votre entreprise"
                  className="md:col-span-1"
                  register={register}
                  error={errors.nom}
                  required
                />

                <RHFSelect
                  label="Taille de l'entreprise"
                  name="tailleEntreprise"
                  control={control}
                  placeholder="Sélectionnez la taille"
                  options={TailleEntrepriseValues}
                  required
                />

                <RHFSelect
                  label="Type de l'entreprise"
                  name="typeEntreprise"
                  control={control}
                  placeholder="Sélectionnez le type"
                  options={TypeEntrepriseValues}
                  required
                />
              </div>

              <RHFRadioGroup
                label="Catégorie de produit textile"
                name="categoryTextile"
                control={control}
                options={CategoryTextileValues}
                required
              />
            </div>

            {/* Section 3: Coordonnées */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-amber-600">
                Coordonnées
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RHFInput
                  label="Adresse"
                  name="adresse"
                  type="text"
                  autoComplete="adresse"
                  placeholder="Adresse complète de l'entreprise"
                  className="md:col-span-2"
                  register={register}
                  error={errors.adresse}
                  required
                />

                <RHFInput
                  label="Téléphone"
                  name="numeroTelephone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+33 XX XX XX XX"
                  register={register}
                  error={errors.numeroTelephone}
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RHFInput
                  label="Ville"
                  name="ville"
                  type="text"
                  autoComplete="ville"
                  placeholder="ville"
                  register={register}
                  error={errors.ville}
                  required
                />

                <RHFInput
                  label="Gouvernemental"
                  name="gouvernemental"
                  type="text"
                  autoComplete="gouvernemental"
                  placeholder="région/province"
                  register={register}
                  error={errors.gouvernemental}
                  required
                />

                <RHFInput
                  label="Code postal"
                  name="codePostal"
                  type="text"
                  autoComplete="codePostal"
                  placeholder="code postal"
                  register={register}
                  error={errors.codePostal}
                  required
                />

                <RHFInput
                  label="Pays"
                  name="pays"
                  type="text"
                  autoComplete="pays"
                  placeholder="pays"
                  register={register}
                  error={errors.pays}
                  required
                />
              </div>
            </div>

            {/* Section 4: Détails finaux */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-amber-600">
                Détails finaux et Validation
              </h2>

              <RHFCheckboxGroup
                control={control}
                name="focusMarche"
                label="Focus marché"
                options={FocusMarcheValues}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="informationsComplementaires">
                  Informations Complémentaires
                </Label>
                <Textarea
                  id="informationsComplementaires"
                  {...register("informationsComplementaires")}
                  placeholder="Partagez toute information supplémentaire concernant les besoins de votre entreprise..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Controller
                    control={control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <Checkbox
                        id="termsAccepted"
                        ref={field.ref}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={cn(errors.termsAccepted && "border-red-500")}
                      />
                    )}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="termsAccepted"
                      className="text-sm font-normal"
                    >
                      {"J'accepte"}{" "}
                      <Link
                        href="#"
                        className="text-amber-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setTermsOfUseModalOpen(true);
                        }}
                      >
                        {"Conditions d'utilisation"}
                      </Link>{" "}
                      et{" "}
                      <Link
                        href="#"
                        className="text-amber-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setPrivacyPolicyModalOpen(true);
                        }}
                      >
                        politique de confidentialité
                      </Link>
                    </Label>
                    {errors.termsAccepted && (
                      <p className="text-red-500 text-sm">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte?{" "}
            <Link
              href="/login"
              className="text-amber-600 hover:text-amber-700 font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>

          <Button
            type="submit"
            form="registrationForm"
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Soumission..." : "Complétez l'inscription"}
          </Button>
        </CardFooter>
      </Card>
      <TermsOfUseModal
        open={termsOfUseModalOpen}
        onOpenChange={setTermsOfUseModalOpen}
      />
      <PrivacyPolicyModal
        open={privacyPolicyModalOpen}
        onOpenChange={setPrivacyPolicyModalOpen}
      />
    </>
  );
}
