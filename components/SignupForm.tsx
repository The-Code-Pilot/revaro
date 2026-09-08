"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDashboardClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react"; // Standard structural vector icons

export default function SignupForm() {
  const router = useRouter();
  const supabase = createDashboardClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Visibility switch tracker

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    setPending(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setPending(false);
      return;
    }

    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }

    setMessage(
      "Account created. Check your email to verify your email address."
    );

    setPending(false);
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
          disabled={pending}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          disabled={pending}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>

          <span className="text-xs text-muted-foreground">
            8+ characters
          </span>
        </div>

        {/* INLINE ACTION HOUSING WRAPPER CONTAINER */}
        <div className="relative flex items-center">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"} // Dynamically mutates field mask type
            placeholder="Create a secure password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={pending}
            className="h-11 pr-10" // Right padding keeps text clear of icon bounds
          />
          {/* TRAP CLICK BUTTON TARGET FOR GRAPHIC TOGGLES */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={pending}
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors disabled:opacity-40"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        className="h-11 w-full mt-4 transition-all duration-200 active:scale-[0.98]"
        type="submit"
        disabled={pending}
      >
        {pending ? "Creating your account..." : "Create account"}
      </Button>

      {message && (
        <p
          className="text-center text-sm text-muted-foreground"
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}