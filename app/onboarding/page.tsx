import { redirect } from "next/navigation";
import { createDashboardClient } from "@/lib/supabase/server";
import OnboardingFormClient from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createDashboardClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signup");
  }

  // SERVER ACTION: Secure, direct-to-database Postgres RPC instantiation channel
  async function completeMerchantSetup(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const provider = String(formData.get("billing_provider") ?? "stripe").trim();
    const tier = String(formData.get("tier") ?? "starter").trim();

    // DATA FUNNEL SANITIZER MATRIX
    const rawSlug = String(formData.get("slug") ?? "").trim().toLowerCase();
    
    // FIXED TRACK: Added the [0] extractor back to flatten the split output array into a single text parameter string matching the DB schema cache
    const cleanSlug = rawSlug
      .replace(/^(https?:\/\/)?(www\.)?/, "") 
      .split("/")[0];                        

    if (!name || !cleanSlug) {
      console.error("Server Action Validation Error: Missing company name or slug inputs.");
      return;
    }

    const supabase = await createDashboardClient();

    // Look up the active user session data securely within the server context
    const { data: { user: activeUser } } = await supabase.auth.getUser();
    if (!activeUser) {
      console.error("Server Session Error: User identity resolved to null.");
      return;
    }

    // Forward variables explicitly matching your fresh Core Schema database function parameters
    const { error } = await supabase.rpc("create_organization", {
      organization_name: name,
      organization_slug: cleanSlug, 
      user_role: role,
      billing_framework: provider,
      subscription_tier: tier,
      authenticated_user_id: activeUser.id
    });

    if (error) {
      console.error("Workspace instantiation database transaction failed:", error.message);
      return;
    }

    // Next.js requirement: Redirect execution must run at the absolute end of the call graph context
    redirect(`/billing?tier=${tier}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 relative">
      {/* Decorative Grid Mesh Subtle Background Graphic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f8f8303_1px,transparent_1px),linear-gradient(to_bottom,#0f8f8303_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Expanded maximum width constraint bounds to 5xl so 3-column rows fit beautifully */}
      <div className="w-full max-w-5xl bg-card border border-border shadow-xl p-6 md:p-10 rounded-2xl relative z-10 transition-all duration-300">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-wider text-muted-foreground/60 uppercase">
            Revora
          </p>
        </div>

        {/* Unified wizard client states layout matrix connected to server action handler */}
        <OnboardingFormClient serverAction={completeMerchantSetup} />
      </div>
    </main>
  );
}