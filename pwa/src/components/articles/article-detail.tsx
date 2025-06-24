"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useArticle, useDeleteArticle } from "@/hooks/use-articles";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface ArticleDetailsProps {
  id: number;
}

export function ArticleDetails({ id }: ArticleDetailsProps) {
  const router = useRouter();
  const { data: article, isLoading, error } = useArticle(id);
  const deleteArticle = useDeleteArticle();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const handleDelete = async () => {
    setDialogData({
      title: `Delete article "${id}"?`,
      description: "Are you sure you want to delete this article?",
      actionLabel: "Delete",
      onConfirm: () => {
        deleteArticle.mutateAsync(id);
        setOpenConfirmDialog(false);
        router.push("/articles");
      },
    });
    setOpenConfirmDialog(true);
  };

  if (isLoading) {
    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            Chargement des détails de l'article...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !article) {
    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-red-600 text-sm sm:text-base">
            {error
              ? `Error loading article: ${
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred"
                }`
              : "Article non trouvé"}
          </div>
          <div className="flex justify-center mt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">
          <div className="items-center gap-2">
            <div>{article?.designation}</div>
            <Badge className="w-fit">{article?.ref}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2">Composition</h3>
          <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
              {article.composition}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2">
            Ordres de fabrication
          </h3>
          <div>
            {article.ordreFabrications &&
            article.ordreFabrications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {article.ordreFabrications?.map((order, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {order}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                Aucune ordre de fabrication associée à cet article
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/articles/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteArticle.isLoading}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </CardFooter>
      {openConfirmDialog && dialogData && (
        <ConfirmDialog
          open={openConfirmDialog}
          onOpenChange={setOpenConfirmDialog}
          title={dialogData.title}
          description={dialogData.description}
          actionLabel={dialogData.actionLabel}
          onConfirm={dialogData.onConfirm}
        />
      )}
    </Card>
  );
}
