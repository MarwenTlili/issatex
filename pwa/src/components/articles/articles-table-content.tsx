"use client";

import { memo } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  BookOpen,
} from "lucide-react";
import { Article, ArticlesFilters } from "@/types/resources/Article";
import { ApiCollection } from "@/types/resources/ApiCollection";
import { MESSAGES } from "@/config/app";

interface ArticlesTableContentProps {
  articlesCollection: ApiCollection<Article> | undefined;
  isLoading: boolean;
  filters: ArticlesFilters;
  onSort: (field: "ref" | "designation") => void;
  onDelete: (id: number, ref: string) => void;
  deleteLoading: boolean;
}

export const ArticlesTableContent = memo(function ArticlesTableContent({
  articlesCollection,
  isLoading,
  filters,
  onSort,
  onDelete,
  deleteLoading,
}: ArticlesTableContentProps) {
  const articles = articlesCollection?.member || [];

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("ref")}
                  className="h-auto p-0 font-semibold"
                >
                  Ref
                  {filters.order?.ref === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("designation")}
                  className="h-auto p-0 font-semibold"
                >
                  Designation
                  {filters.order?.designation === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Composition</TableHead>
              <TableHead>Orders de fabrication</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">{MESSAGES.LOADING.ARTICLES}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Aucun article trouvé
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {article.ref}
                  </TableCell>
                  <TableCell>{article.designation}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {article.composition}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {article.ordreFabrications?.length} orders
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/client/articles/${article.id}`}>
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/client/articles/${article.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          article.id &&
                          article.ref &&
                          onDelete(article.id, article.ref)
                        }
                        disabled={deleteLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun article trouvé
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs whitespace-nowrap"
                    >
                      {article.ref}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs whitespace-nowrap"
                    >
                      {article.ordreFabrications?.length} orders
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm">{article.designation}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/client/articles/${article.id}`}
                        className="flex items-center"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Détails
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/client/articles/${article.id}/edit`}
                        className="flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        article.id &&
                        article.ref &&
                        onDelete(article.id, article.ref)
                      }
                      disabled={deleteLoading}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.composition}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
});
