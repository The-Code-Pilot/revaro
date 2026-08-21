import { redirect } from "next/navigation";
import { createDashboardClient } from "@/lib/supabase/server";
import { getCurrentOrganization } from "@/lib/organizations/current";

export default async function DashboardPage() {
  const supabase = await createDashboardClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signup");
  }

  const currentOrganization = await getCurrentOrganization();

  if (!currentOrganization) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-muted-foreground">
            {currentOrganization.organization.name}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {currentOrganization.organization.slug}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-muted-foreground">
            Your retention command center starts here.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Cancellation sessions
            </p>
            <p className="mt-2 text-3xl font-semibold">0</p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Customers recovered
            </p>
            <p className="mt-2 text-3xl font-semibold">0</p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Revenue recovered
            </p>
            <p className="mt-2 text-3xl font-semibold">$0</p>
          </div>
        </section>

        <section className="mt-8 rounded-xl border bg-card p-8">
          <h2 className="text-lg font-semibold">
            Your Revora workspace
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Connect your subscription business and start turning
            cancellation moments into retained revenue.
          </p>

          <p className="mt-6 text-xs text-muted-foreground">
            Signed in as {user.email}
          </p>
        </section>
      </div>
    </main>
  );
}
