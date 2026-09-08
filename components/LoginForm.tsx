"use client"
import { useActionState, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from '@/app/auth/actions'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
    const initialState = {
        message: ''
    }
    
    const [formState, formAction] = useActionState(loginUser, initialState)
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }
    
    return (<>
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    required
                />
            </div>
            
            <div className="grid gap-2 mt-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
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
            
            {/* FIXED TRACK: Injected h-11 height alignment, standard transitions, and click scales to match signup */}
            <Button className="w-full h-11 mt-4 transition-all duration-200 active:scale-[0.98]" type="submit">Log In</Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
            )}
        </form>
    </>)
}