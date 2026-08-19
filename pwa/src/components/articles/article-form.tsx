"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { RHFInput } from "@/components/form/RHFInput";
import { ErrorState } from "@/components/common/error-state";

import {
  useArticle,
  useCreateArticle,
  useUpdateArticle,
} from "@/hooks/use-articles";
import { articleSchema, type ArticleFormData } from "@/lib/validation/schemas";
import { handleFormSubmitError } from "@/lib/api/handle-api-error";

import { APP_ROUTES, MESSAGES } from "@/config/app";

interface ArticleFormProps {
  articleId?: number;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const isEdit = !!articleId;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      composition: "",
      designation: "",
    },
  });

  const {
    data: article,
    isLoading: isLoadingArticle,
    refetch,
    error,
  } = useArticle(articleId);

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

  const onSubmit = async (data: ArticleFormData) => {
    try {
      if (isEdit && articleId) {
        await updateArticle.mutateAsync({ id: articleId, ...data });
        toast.success(MESSAGES.SUCCESS.ARTICLE_UPDATED, {
          description: "Vos modifications ont été enregistrées.",
        });
      } else {
        await createArticle.mutateAsync(data);
        toast.success(MESSAGES.SUCCESS.ARTICLE_CREATED, {
          description: "Le nouvel article a été ajouté à votre collection.",
        });
      }
      router.push(APP_ROUTES.CLIENT.ARTICLES);
    } catch (error) {
      handleFormSubmitError<ArticleFormData>(
        error,
        setError,
        isEdit
          ? "Impossible de modifier l'article."
          : "Impossible de créer l'article.",
      );
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

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        backUrl={APP_ROUTES.CLIENT.ARTICLES}
        backLabel="Retour aux articles"
      />
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <RHFInput
            label="Désignation"
            name="designation"
            type="text"
            placeholder="Entres la désignation de l'article"
            autoComplete="designation"
            register={register}
            error={errors.designation}
            required
          />

          <FormField
            label="Composition"
            htmlFor="composition"
            error={errors.composition?.message}
            required
            description="Description détaillée de l'article"
          >
            <Textarea
              id="composition"
              {...register("composition")}
              placeholder="Entrez la composition de l'article"
              rows={4}
              className={errors.composition ? "border-red-500" : ""}
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
              Retour aux articles
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
