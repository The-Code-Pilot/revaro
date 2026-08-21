import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SignupForm from "@/components/SignupForm";
import ProviderSigninBlock from "@/components/ProviderSigninBlock";

export default function Signup() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <Card className="w-full max-w-[420px] border-border/60 shadow-xl">
        <CardHeader className="space-y-5 pb-5">
          <Link
            href="/"
            className="mx-auto flex items-center justify-center text-2xl font-bold tracking-tight"
            aria-label="Revora home"
          >
            Revora
          </Link>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your Revora account
            </h1>

            <p className="text-sm leading-6 text-muted-foreground">
              Start reducing churn and recovering more subscription revenue.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <SignupForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <ProviderSigninBlock />

          <p className="text-center text-xs leading-5 text-muted-foreground">
            By creating an account, you agree to Revora&apos;s terms and
            acknowledge its privacy policy.
          </p>
        </CardContent>

        <CardFooter className="justify-center border-t border-border/60 pt-5">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}