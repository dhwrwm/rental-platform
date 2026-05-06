"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { buttonVariants } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { cn } from "@lib/utils";
import { authClient } from "../api/auth-client";

export function SessionHome() {
  const router = useRouter();
  const { data, error, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (!isPending && user) {
      router.replace("/dashboard");
    }
  }, [isPending, router, user]);

  if (isPending || user) {
    return (
      <main className="px-6 py-6 sm:px-8">
        <section className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-7xl items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Session status
              </p>
              <CardTitle>
                {isPending ? "Checking session..." : "Opening dashboard..."}
              </CardTitle>
              {error ? (
                <CardDescription className="text-destructive">
                  {error.message}
                </CardDescription>
              ) : (
                <CardDescription>
                  Signed-in users are redirected straight to their protected
                  dashboard.
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="px-6 py-6 sm:px-8">
      <section className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.3fr)_26rem]">
        <div className="space-y-8 text-foreground">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-normal text-foreground/80 shadow-sm">
              Rental Platform
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-normal sm:text-6xl lg:text-8xl">
              Short stays, long leases, one account.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">
              Email and password auth is now wired into the web app. Users can
              create an account, sign in, and keep a live session on the client.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className={cn(buttonVariants({ size: "lg" }))} href="/signup">
              Create account
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
              )}
              href="/login"
            >
              Log in
            </Link>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-5 shadow-sm">
              <p className="text-sm font-medium text-foreground/70">
                Design system
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/88">
                Tailwind utilities replace route-local CSS so shared patterns
                can grow with the product.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-5 shadow-sm">
              <p className="text-sm font-medium text-foreground/70">
                Auth state
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/88">
                Better Auth still drives sign-in, sign-up, sign-out, and live
                client session checks.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-5 shadow-sm">
              <p className="text-sm font-medium text-foreground/70">
                Brand tokens
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/88">
                The new palette keeps the product anchored to the dark teal
                brand direction using OKLCH theme variables.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Session status
            </p>
            {error ? (
              <CardDescription className="text-destructive">
                {error.message}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            {
              <>
                <CardTitle>No active session</CardTitle>
                <CardDescription className="mt-3 text-sm leading-7">
                  Sign up or log in to confirm the Better Auth cookie flow
                  between `apps/web` and `apps/api`.
                </CardDescription>
              </>
            }
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
