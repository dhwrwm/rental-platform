"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@components/ui/button";
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

  async function handleSignOut() {
    const result = await authClient.signOut();

    if (result.error) {
      return;
    }

    router.refresh();
  }

  const user = data?.user;

  return (
    <main className="px-6 py-6 sm:px-8">
      <section className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.3fr)_26rem]">
        <div className="space-y-8 text-foreground">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/90 backdrop-blur-sm">
              Rental Platform
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.08em] sm:text-6xl lg:text-8xl">
              Short stays, long leases, one account.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">
              Email and password auth is now wired into the web app. Users can
              create an account, sign in, and keep a live session on the client.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {user ? (
              <Button onClick={handleSignOut} size="lg" type="button">
                Sign out
              </Button>
            ) : (
              <>
                <Link
                  className={cn(buttonVariants({ size: "lg" }))}
                  href="/signup"
                >
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
              </>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground/70">
                Design system
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/88">
                Tailwind utilities replace route-local CSS so shared patterns
                can grow with the product.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground/70">
                Auth state
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/88">
                Better Auth still drives sign-in, sign-up, sign-out, and live
                client session checks.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
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

        <Card className="border-white/15 bg-card/88">
          <CardHeader className="pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Session status
            </p>
            {isPending ? <CardTitle>Checking session...</CardTitle> : null}
            {error ? (
              <CardDescription className="text-destructive">
                {error.message}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <CardTitle>{user.name}</CardTitle>
                <dl className="mt-6 grid gap-4">
                  <div className="grid gap-1 border-t border-border/80 pt-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Email
                    </dt>
                    <dd className="text-sm text-card-foreground">
                      {user.email}
                    </dd>
                  </div>
                  <div className="grid gap-1 border-t border-border/80 pt-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Email verified
                    </dt>
                    <dd className="text-sm text-card-foreground">
                      {user.emailVerified ? "Verified" : "Pending verification"}
                    </dd>
                  </div>
                </dl>
              </>
            ) : isPending ? null : (
              <>
                <CardTitle>No active session</CardTitle>
                <CardDescription className="mt-3 text-sm leading-7">
                  Sign up or log in to confirm the Better Auth cookie flow
                  between `apps/web` and `apps/api`.
                </CardDescription>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
