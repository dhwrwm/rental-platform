"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { authClient } from "../api/auth-client";
import type { AuthMode } from "../types/auth";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const fallbackError = "Something went wrong. Please try again.";
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message ?? fallbackError);
          return;
        }
      } else {
        const name = String(formData.get("name") ?? "").trim();

        const result = await authClient.signUp.email({
          email,
          password,
          name: name || email,
        });

        if (result.error) {
          setError(result.error.message ?? fallbackError);
          return;
        }
      }

      router.push("/");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-svh w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.15fr)_28rem] lg:px-8">
      <div className="space-y-6 text-foreground">
        <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/90 backdrop-blur-sm">
          Rental Platform
        </p>
        <div className="space-y-4">
          <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.08em] sm:text-6xl lg:text-7xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">
            {isLogin
              ? "Sign in to manage bookings, listings, and your renter profile."
              : "Start browsing stays, managing bookings, and building your host profile."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-foreground/70">
              Why this matters
            </p>
            <p className="mt-2 text-sm leading-7 text-foreground/88">
              A cleaner auth surface gives us a reusable foundation for guest,
              host, and operations flows.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-foreground/70">
              UI direction
            </p>
            <p className="mt-2 text-sm leading-7 text-foreground/88">
              Tailwind tokens and shadcn-style primitives now drive the visual
              language instead of page-scoped CSS.
            </p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-white/15 bg-card/92">
        <CardHeader className="pb-4">
          <CardTitle>{isLogin ? "Log in" : "Create your profile"}</CardTitle>
          <CardDescription>
            Use your email and password to access bookings, listings, and renter
            activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            {!isLogin ? (
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  autoComplete="name"
                  id="name"
                  name="name"
                  placeholder="Ava Morgan"
                  required
                  type="text"
                />
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete={isLogin ? "current-password" : "new-password"}
                id="password"
                minLength={8}
                name="password"
                placeholder="At least 8 characters"
                required
                type="password"
              />
            </div>

            {error ? <Alert>{error}</Alert> : null}

            <Button
              className="w-full"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                  ? "Log in"
                  : "Sign up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Need an account?" : "Already have an account?"}{" "}
              <Link
                className="font-semibold text-primary transition hover:text-primary/80"
                href={isLogin ? "/signup" : "/login"}
              >
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
