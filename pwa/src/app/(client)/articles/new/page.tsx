import { ArticleForm } from "@/components/articles/article-form";

export default async function CreateArticlePage() {
  return (
    <div className="container">
      <div className="p-2 sm:p-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Créer un nouvel article</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Ajouter un nouvel article à votre collection
        </p>
      </div>
      <ArticleForm />
    </div>
  );
}
