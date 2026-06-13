"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FactoryIcon as Fabric } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { LoginFormData, loginFormSchema } from "@/lib/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  extractFormErrors,
  handleApiError,
  isApiError,
  isValidationError,
} from "@/lib/api/handle-api-error";
import { RHFInput } from "@/components/form/RHFInput";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    shouldFocusError: true,
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      // 1. Handle Successful Login
      if (response?.ok) {
        router.refresh();
        return;
      }

      // 2. Handle 401 / Credentials Failure
      if (response?.status === 401 || response?.error === "CredentialsSignin") {
        setError("root.serverError", {
          type: "manual",
          message: "Nom d'utilisateur ou mot de passe incorrect.",
        });
        return;
      }

      // 3. Handle other next-auth edge case responses if any
      setError("root.serverError", {
        type: "manual",
        message: "Une erreur inattendue est survenue.",
      });
    } catch (err) {
      if (!isApiError(err)) {
        throw err;
      }

      if (isValidationError(err)) {
        const formErrors = extractFormErrors(err);

        Object.entries(formErrors).forEach(([field, message], index) => {
          setError(
            field as keyof LoginFormData,
            {
              type: "api",
              message,
            },
            {
              shouldFocus: index === 0,
            },
          );
        });

        return;
      }

      handleApiError(err, {
        customMessage: "Erreur lors de l'enregistrement de l'utilisateur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen md:min-h-0 max-w-5xl bg-white md:rounded-3xl shadow-xl border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 md:m-4">
      {/* Left Side: Keeping the "bag" section entirely intact */}
      <div className="hidden md:flex md:col-span-5 bg-[#3A3530] relative flex-col justify-between p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18] via-transparent to-[#2C2A29]/50 z-10"></div>

        <Image
          src="/images/bag.jpg"
          alt="Texture de textile tissé"
          width={800}
          height={1200}
          priority={true}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 scale-105 transform hover:scale-100 transition-transform duration-1000"
        />

        <div className="relative z-20">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-200/80">
            Depuis 2012
          </span>
        </div>

        <div className="relative z-20 space-y-3">
          <h2 className="text-3xl font-light italic leading-tight text-stone-100 font-serif">
            Tisser la tradition au fil de la précision digitale.
          </h2>
          <p className="text-xs text-stone-300 font-light tracking-wide max-w-xs">
            Accédez à votre tableau de bord B2B, vos catalogues de tissus et au
            suivi de production en temps réel.
          </p>
        </div>
      </div>

      {/* Right Side: Redesigned to fit the ClientRegistrationForm design language */}
      <div className="col-span-1 md:col-span-7 flex flex-col justify-between bg-white">
        {/* Header matching registration styles */}
        <div className="bg-white border-b p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Fabric className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Issatex - Connexion
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ravi de vous revoir ! Saisissez vos identifiants pour gérer vos
            ordres de fabrication.
          </p>
        </div>

        {/* Core Form Elements styled using standard classes */}
        <div className="p-6 sm:p-8 flex-grow flex flex-col justify-center">
          <form
            id="loginForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 border-amber-600">
                Informations d'authentification
              </h2>

              <div className="space-y-4">
                <RHFInput
                  label="Nom d'utilisateur"
                  name="username"
                  type="text"
                  placeholder="votre nom d'utilisateur"
                  autoComplete="username"
                  register={register}
                  error={errors.username}
                  required
                />

                <RHFInput
                  label="Mot de passe"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="*******"
                  register={register}
                  error={errors.password}
                  required
                />
              </div>

              {/* Global 401 Error Alert */}
              {errors.root?.serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-600 animate-in fade-in duration-200">
                  <svg
                    className="h-5 w-5 shrink-0 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{errors.root.serverError.message}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer block adapting register footer aesthetics */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-amber-600 hover:text-amber-700 font-medium hover:underline"
            >
              S'inscrire
            </Link>
          </p>

          <Button
            type="submit"
            form="loginForm"
            disabled={isLoading}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
