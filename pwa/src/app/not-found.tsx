import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import MainLayout from "./(main)/layout";

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-background to-muted/50 p-4 text-center">
        <div className="mx-auto max-w-md space-y-4">
          {/* 404 Text with animation */}
          <h1 className="animate-pulse text-8xl font-extrabold tracking-tight text-primary">
            404
          </h1>

          {/* Illustration - Fixed dimensions to prevent layout shift */}
          <div className="relative mx-auto h-40 w-40 rounded-full bg-muted/80">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              {/* Add explicit width/height and ensure icon loads with a placeholder space */}
              <div className="h-20 w-20 flex items-center justify-center">
                <Search
                  className="h-20 w-20 text-muted-foreground/90"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Page not found
            </h2>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved or deleted.
            </p>
          </div>

          {/* Action button - Fixed height and min-width to prevent layout shift */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex h-10 min-w-[144px] items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {/* Wrapper div with fixed width for icon to prevent shift */}
              <span className="mr-2 flex h-4 w-4 items-center justify-center">
                <ArrowLeft className="h-4 w-4" />
              </span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
