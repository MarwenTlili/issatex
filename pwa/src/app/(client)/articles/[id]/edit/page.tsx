import { ArticleForm } from "@/components/articles/article-form";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const articleId = Number.parseInt(params.id);

  return (
    <div className="container">
      <div className="p-2 sm:p-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier l'article</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Mettez à jour les détails de votre article
        </p>
      </div>
      <ArticleForm articleId={articleId} />
    </div>
  );
}
