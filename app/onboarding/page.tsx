import { redirect } from "next/navigation";
import { createDashboardClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createDashboardClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signup");
  }

  async function createOrganization(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();

    if (!name || !slug) {
      return;
    }

    const supabase = await createDashboardClient();

    const { error } = await supabase.rpc("create_organization", {
      organization_name: name,
      organization_slug: slug.toLowerCase(),
    });

    if (error) {
      console.error("Organization creation failed:", error);
      return;
    }

    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground">
            Revora
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Create your workspace
          </h1>

          <p className="mt-2 text-muted-foreground">
            Set up your Revora workspace to start reducing subscription churn.
          </p>
        </div>

        <form action={createOrganization} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Company or workspace name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Acme"
              required
              className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-medium"
            >
              Workspace URL
            </label>

            <div className="flex h-11 items-center rounded-lg border bg-background">
              <span className="pl-3 text-sm text-muted-foreground">
                revora.app/
              </span>

              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="acme"
                required
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Create workspace
          </button>
        </form>
      </div>
    </main>
  );
}