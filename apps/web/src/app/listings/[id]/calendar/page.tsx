import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { AuthenticatedHeader } from "@features/auth";

type ListingCalendarPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingCalendarPage({
  params,
}: ListingCalendarPageProps) {
  const { id } = await params;

  return (
    <main className="px-6 py-6 sm:px-8">
      <AuthenticatedHeader />
      <section className="mx-auto mt-6 grid w-full max-w-7xl gap-6">
        <header className="rounded-4xl border border-border/70 bg-card/70 p-8 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Listing calendar
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
                Availability calendar
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Manage booked dates, owner blocks, and available windows for
                listing `{id}`.
              </p>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Availability controls will appear here.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
}
