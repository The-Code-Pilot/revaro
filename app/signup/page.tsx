import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SignupForm from "@/components/SignupForm";
import ProviderSigninBlock from "@/components/ProviderSigninBlock";

export default function Signup() {
  return (
    <div className="flex items-center justify-center bg-muted min-h-screen">
      <Card className="w-full max-w-[420px] bg-white border border-slate-200/80 shadow-md p-2">
        <CardHeader className="space-y-5 pb-5">
          <Link
            href="/"
            className="mx-auto flex items-center justify-center text-2xl font-black tracking-tight text-foreground"
            aria-label="Revora home"
          >
            <span className="text-[#0F8F83] mr-0.5">Revora</span>
          </Link>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your Revora account
            </h1>

            <p className="text-sm leading-6 text-muted-foreground">
              Start reducing churn and recovering more subscription revenue.
            </p>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          <SignupForm />

          {/* DIVIDER ACCORD MATRIX LINKED EXACTLY TO MATCH YOUR LOGIN CARD */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <ProviderSigninBlock />
        </CardContent>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed mt-3 mb-3 max-w-xs mx-auto">
  By creating an account, you agree to Revora's{' '}
  <Link href="/terms" className="text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-[#0F8F83]">Terms</Link> and acknowledge its{' '}
  <Link href="/privacy" className="text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-[#0F8F83]">Privacy Policy</Link>.
</p>

        <CardFooter className="justify-center border-t border-border/60 pt-5">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#0F8F83] hover:underline underline-offset-4 transition-colors"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}