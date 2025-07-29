"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { CreateArticleData } from "@/types/resources/Article";
import {
  useCreateArticle,
  useUpdateArticle,
  useArticle,
} from "@/hooks/use-articles";

interface ArticleFormProps {
  articleId?: number;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const isEdit = !!articleId;
  const router = useRouter();
  const { data: article } = useArticle(articleId!);
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [formData, setFormData] = useState<CreateArticleData>({
    designation: "",
    composition: "",
  });

  // Update form data when article is loaded
  useEffect(() => {
    if (article) {
      setFormData({
        designation: article.designation,
        composition: article.composition,
      });
    }
  }, [article]);

  const isLoading = createArticle.isLoading || updateArticle.isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && articleId) {
        await updateArticle.mutateAsync({
          id: articleId,
          ...formData,
        });
        router.push(`/articles`);
      } else {
        await createArticle.mutateAsync({
          ...formData,
        });
        router.push(`/articles`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (field: keyof CreateArticleData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {isEdit ? (
            <div className="flex gap-2">
              <div>Réference</div>
              {article?.ref ? (
                <Badge className="w-fit whitespace-nowrap">
                  {article?.ref}
                </Badge>
              ) : (
                ""
              )}
            </div>
          ) : (
            "Propriétés"
          )}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="designation" className="text-sm sm:text-base">
              Designation
            </Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="Article designation"
              required
              className="text-sm sm:text-base max-w-80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="composition" className="text-sm sm:text-base">
              Composition
            </Label>
            <Textarea
              id="composition"
              value={formData.composition}
              onChange={(e) => handleChange("composition", e.target.value)}
              placeholder="Article composition details..."
              rows={4}
              required
              className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={"/client/articles"}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading
              ? "Enregistrement ..."
              : isEdit
              ? "Modifier l'article"
              : "Nouveau Article"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
