"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ErrorState } from "@/components/common/error-state";

import { useArticle, useDeleteArticle } from "@/hooks/use-articles";
import { handleApiError } from "@/lib/api/handle-api-error";

import { APP_ROUTES, MESSAGES } from "@/config/app";

interface ArticleDetailsProps {
  id: number;
}

export function ArticleDetails({ id }: ArticleDetailsProps) {
  const router = useRouter();
  const { data: article, isLoading, refetch, error } = useArticle(id);
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
      title: MESSAGES.ACTION.DELETE,
      description: `${MESSAGES.DIALOG.ARTICLE_DELETE} ${article?.ref}`,
      actionLabel: MESSAGES.ACTION.DELETE,
      onConfirm: async () => {
        try {
          await deleteArticle.mutateAsync(id);
          toast.success("L'article à été supprimer de votre collection.");
          setOpenConfirmDialog(false);
          router.push(APP_ROUTES.CLIENT.ARTICLES);
        } catch (error) {
          handleApiError(error, "Article ne peut pa être supprimer.");
          setOpenConfirmDialog(false);
        }
      },
    });
    setOpenConfirmDialog(true);
  };

  if (isLoading) {
    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">{MESSAGES.LOADING.ARTICLE}</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !article) {
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
                    <Link
                      href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_DETAIL(
                        Number(order.split("/").pop() ?? 0),
                      )}
                    >
                      {order}
                    </Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                {MESSAGES.ERROR.ORDRES_FABRICATION_FETCH_ERROR}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
        <Button
          variant="outline"
          asChild
          className="w-full sm:w-auto bg-transparent"
        >
          <Link href={APP_ROUTES.CLIENT.ARTICLES}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux articles
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto bg-transparent"
          >
            <Link href={APP_ROUTES.CLIENT.ARTICLE_EDIT(article.id)}>
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
