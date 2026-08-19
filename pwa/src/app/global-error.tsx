"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mapError } from "@/lib/api/handle-api-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { title, message } = mapError(error);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {title ?? "Something went wrong!"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                We&apos;ve encountered an unexpected error. Our team has been
                notified.
              </p>
              {error.digest && (
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-md p-3 mb-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <p>{message}</p>
                    Error ID: {error.digest}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={() => reset()}
                  className="flex-1 gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Button>
                <Button asChild variant="outline" className="flex-1 gap-2">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
