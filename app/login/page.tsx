import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import Link from 'next/link'

import ProviderSigninBlock from '@/components/ProviderSigninBlock'
import LoginForm from "@/components/LoginForm"
export default function Login() {
    return (
        <div className="flex items-center justify-center bg-muted min-h-screen">
            <Card className="w-full max-w-[420px] bg-white border border-slate-200/80 shadow-md p-2">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Link href='/'>
                        <span className="font-black text-2xl tracking-tight text-[#0F8F83]">Revora</span>
                        </Link>
                    </div>

                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Choose your preferred login method</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <LoginForm />
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
                <CardFooter className="flex flex-col gap-2 text-center pt-2 pb-6">
                  {/* FORGOT PASSWORD LINK - UNDERLINES SOFTLY ON HOVER */}
                  <Link 
                    className="w-full text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors font-medium" 
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>

                  {/* ACCOUNT REDIRECT TEXT - SPLIT SO ONLY "SIGNUP" GLOWS IN ACTIVE RIVER TEAL */}
                  <p className="w-full text-xs text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link 
                      className="font-bold text-primary hover:underline underline-offset-4 transition-colors" 
                      href="/signup"
                    >
                      Signup
                    </Link>
                  </p>
                </CardFooter>
            </Card>
        </div>
    )
}