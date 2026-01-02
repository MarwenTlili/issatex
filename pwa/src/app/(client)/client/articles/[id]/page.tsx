import { ArticleDetails } from "@/components/articles/article-detail";

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const articleId = Number.parseInt(params.id);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Détails de l&apos;article</h1>
      <ArticleDetails id={articleId} />
    </div>
  );
}
