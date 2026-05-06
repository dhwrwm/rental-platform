"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, buttonVariants } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { cn } from "@lib/utils";
import { authClient } from "@features/auth/api/auth-client";

export function DashboardHome() {
  const router = useRouter();
  const { data, error, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, router, user]);

  async function handleSignOut() {
    const result = await authClient.signOut();

    if (result.error) {
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (isPending || !user) {
    return (
      <main className="px-6 py-6 sm:px-8">
        <section className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-7xl items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Dashboard access
              </p>
              <CardTitle>
                {isPending ? "Checking session..." : "Redirecting to login..."}
              </CardTitle>
              {error ? (
                <CardDescription className="text-destructive">
                  {error.message}
                </CardDescription>
              ) : (
                <CardDescription>
                  We&apos;re confirming your session before loading the
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
      <section className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-normal text-foreground/75">
              Dashboard
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              Welcome back, {user.name}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">
              Your renter and host workspace is protected behind the active
              Better Auth session, so this page is only available to signed-in
              users.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={handleSignOut} size="lg" type="button">
                Sign out
              </Button>
              <Link
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                )}
                href="/"
              >
                Back to landing page
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listings</CardTitle>
                <CardDescription>
                  Add host inventory, adjust pricing, and review occupancy.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bookings</CardTitle>
                <CardDescription>
                  Track active stays, upcoming arrivals, and renter activity.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>
                  Keep account details, verification state, and preferences in
                  one place.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Session details
            </p>
            <CardTitle>{user.email}</CardTitle>
            <CardDescription>
              The dashboard is visible because an authenticated session is
              present in the Better Auth client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <div className="grid gap-1 border-t border-border/80 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  Full name
                </dt>
                <dd className="text-sm text-card-foreground">{user.name}</dd>
              </div>
              <div className="grid gap-1 border-t border-border/80 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  Email
                </dt>
                <dd className="text-sm text-card-foreground">{user.email}</dd>
              </div>
              <div className="grid gap-1 border-t border-border/80 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  Verification
                </dt>
                <dd className="text-sm text-card-foreground">
                  {user.emailVerified ? "Verified" : "Pending verification"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
