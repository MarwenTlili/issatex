import { ArticlesTable } from "@/components/articles/articles-table";

export default async function ArticlesPage() {
  return (
    <div className="container max-w-full p-2 sm:p-4">
      <ArticlesTable />
    </div>
  );
}
