"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockIcon, UserIcon, LogInIcon } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      }

      // The middleware will handle the redirect based on user roles
      if (result?.ok) {
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <LogInIcon className="h-10 w-10 text-primary" />
          </div>
        </div>

        <Card className="border-muted/30 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              <span>Don&apos;t have an account? </span>
              <a
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </a>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <a href="#" className="font-medium text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
