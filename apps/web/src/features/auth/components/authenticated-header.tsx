"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { authClient } from "../api/auth-client";

export function AuthenticatedHeader() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  async function handleSignOut() {
    const result = await authClient.signOut();

    if (result.error) {
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-3xl border border-border/70 bg-card/80 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link
          className="text-lg font-semibold tracking-normal"
          href="/dashboard"
        >
          Rental Platform
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPending
            ? "Checking session..."
            : user
              ? `Signed in as ${user.email}`
              : "No active session"}
        </p>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        <Link
          className={cn(buttonVariants({ size: "default", variant: "ghost" }))}
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className={cn(buttonVariants({ size: "default", variant: "ghost" }))}
          href="/listings"
        >
          Listings
        </Link>
        <Link
          className={cn(
            buttonVariants({ size: "default", variant: "secondary" }),
          )}
          href="/"
        >
          Home
        </Link>
        {user ? (
          <button
            className={cn(buttonVariants({ size: "default" }))}
            onClick={() => void handleSignOut()}
            type="button"
          >
            Sign out
          </button>
        ) : (
          <Link
            className={cn(buttonVariants({ size: "default" }))}
            href="/login"
          >
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
