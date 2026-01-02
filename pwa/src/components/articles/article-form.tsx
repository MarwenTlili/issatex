"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useArticle,
  useCreateArticle,
  useUpdateArticle,
} from "@/hooks/use-articles";
import { articleSchema, type ArticleFormData } from "@/lib/validation/schemas";
import { Textarea } from "@/components/ui/textarea";
import {
  type ApiError,
  handleApiError,
  extractFormErrors,
  isValidationError,
  type FormErrors,
} from "@/lib/api/handle-api-error";
import { APP_ROUTES, MESSAGES } from "@/config/app";

interface ArticleFormProps {
  articleId?: number;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const isEdit = !!articleId;
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      composition: "",
      designation: "",
    },
  });

  const { data: article, isLoading: isLoadingArticle } = useArticle(articleId);

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  useEffect(() => {
    if (isEdit && article) {
      reset({
        composition: article.composition,
        designation: article.designation,
      });
    }
  }, [isEdit, article, reset]);

  const handleInputChange = (fieldName: keyof ArticleFormData) => {
    if (apiErrors[fieldName]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      clearErrors(fieldName);
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    try {
      setApiErrors({});

      if (isEdit && articleId) {
        await updateArticle.mutateAsync({ id: articleId, ...data });
      } else {
        await createArticle.mutateAsync(data);
      }
      router.push(APP_ROUTES.CLIENT.ARTICLES);
    } catch (error) {
      const apiError = error as ApiError;

      if (isValidationError(apiError)) {
        const formErrors = extractFormErrors(apiError);
        setApiErrors(formErrors);

        // Set form errors for react-hook-form
        Object.entries(formErrors).forEach(([field, message]) => {
          setError(field as keyof ArticleFormData, {
            type: "api",
            message,
          });
        });
      } else {
        if ((apiError.status && apiError.status >= 500) || !apiError.status) {
          // Server errors or network errors should trigger error boundary
          throw new Error(apiError.title || apiError.detail || "Server error");
        } else {
          // Handle client errors (4xx) with toast
          handleApiError(apiError, {
            customMessage: isEdit
              ? "Impossible de modifier l'article. Vérifiez vos données."
              : "Impossible de créer l'article. Vérifiez vos données.",
          });
        }
      }
    }
  };

  const isLoading =
    isSubmitting || createArticle.isLoading || updateArticle.isLoading;

  if (isEdit && isLoadingArticle) {
    return (
      <Card className="mx-4 sm:mx-0 max-w-2xl">
        <CardContent className="p-6">
          <LoadingSpinner text={MESSAGES.LOADING.ARTICLE} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {isEdit ? "Modifier l'article" : "Créer un nouvel article"}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <FormField
            label="Désignation"
            htmlFor="designation"
            error={errors.designation?.message || apiErrors.designation}
            required
          >
            <Input
              id="designation"
              {...register("designation", {
                onChange: () => handleInputChange("designation"),
              })}
              placeholder="Entrez la désignation de l'article"
              className={
                errors.designation || apiErrors.designation
                  ? "border-red-500 max-w-80"
                  : "max-w-80"
              }
            />
          </FormField>
          <FormField
            label="Composition"
            htmlFor="composition"
            error={errors.composition?.message || apiErrors.composition}
            required
            description="Description détaillée de l'article"
          >
            <Textarea
              id="composition"
              {...register("composition", {
                onChange: () => handleInputChange("composition"),
              })}
              placeholder="Entrez la composition de l'article"
              rows={4}
              className={
                errors.composition || apiErrors.composition
                  ? "border-red-500"
                  : ""
              }
            />
          </FormField>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full sm:w-auto bg-transparent"
          >
            <Link href={APP_ROUTES.CLIENT.ARTICLES}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Annuler
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={isLoading || (!isDirty && isEdit)}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : isEdit ? (
              "Mettre à jour"
            ) : (
              "Créer l'article"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
