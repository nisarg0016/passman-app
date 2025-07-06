import React from 'react'
import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { login, register, vaultFetch } from '@/lib/api/landing'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast, Toaster } from 'sonner'

type LoginProps = {
    setView: (view: string) => void
}

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: 'Your one-time password must be 6 characters.'
    })
})

function Login({ setView }: LoginProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: ""
        }
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await login(username, pass, data.pin, true)
            .then(async (retVal) => {
                console.log(retVal)
                if (retVal.loginSuccess == true) {
                    const token = retVal.response.token
                    console.log(token)
                    await vaultFetch(username, token).then((vault) => {
                        console.log(vault)
                        setView('dashboard')
                        setPass('')
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            })
            .catch((e) => {
                toast('My first toast')
                console.log(e)
                setError({
                    b: true,
                    message: e.response.error
                })
            })
    }
    const [username, setName] = useState('')
    const [pass, setPass] = useState('')
    const [repass, set2Pass] = useState('')
    const [loginShow, setLoginRegister] = useState(true)
    const [twofa, set2fa] = useState(false)
    const [loginError, setError] = useState({b: false, message: ""})

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster className="justify-center"/>
            {twofa == true && (
                <Card className="w-sm">
                    <CardContent className="grid justify-center gap-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem className="gap-4">
                                            <FormLabel className="justify-center">
                                                One-Time Password
                                            </FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={6}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                    {...field}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {loginError.b == true && (
                                    <Alert variant="destructive">
                                        <AlertCircleIcon />
                                        <AlertTitle>
                                            Unable to login. {loginError.message}
                                        </AlertTitle>
                                    </Alert>
                                )}

                                <Button type="submit">Login</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
            {twofa == false && (
                <Card className="w-lg">
                    <CardHeader>
                        <CardTitle>
                            {loginShow == true ? 'Login to your account' : 'Sign up'}
                        </CardTitle>
                        <CardDescription>
                            {loginShow == true
                                ? 'Enter your details below to login to your account'
                                : 'Enter your details below to sign up'}
                        </CardDescription>
                        <CardAction>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setLoginRegister(!loginShow)
                                    setError({
                                        b: false,
                                        message: ''
                                    })
                                }}
                            >
                                {loginShow == true ? 'Sign Up' : 'Login'}
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid gap-4">
                                <div className="flex flex-col gap-3">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Username"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        onChange={(e) => setPass(e.target.value)}
                                        required
                                    />
                                    {loginShow == false && (
                                        <Input
                                            id="reenter"
                                            type="password"
                                            placeholder="Re-enter the password"
                                            onChange={(e) => set2Pass(e.target.value)}
                                            required
                                        />
                                    )}
                                    {loginError.b == true && loginShow == true && (
                                        <Alert variant="destructive">
                                            <AlertCircleIcon />
                                            <AlertTitle>
                                                Unable to login. {loginError.message}
                                            </AlertTitle>
                                        </Alert>
                                    )}
                                    {loginError.b == true && loginShow == false && (
                                        <Alert variant="destructive">
                                            <AlertCircleIcon />
                                            <AlertTitle>
                                                Unable to register. {loginError.message}
                                            </AlertTitle>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        {loginShow == false ? (
                            <Button
                                type="register"
                                className="w-full"
                                onClick={async () => {
                                    await register(username, pass, repass)
                                        .then((success) => {
                                            if (success.code == 200) setLoginRegister(true)
                                        })
                                        .catch((e) => {
                                            console.log(e)
                                            setError({
                                                b: true,
                                                message: e.response.error
                                            })
                                        })
                                }}
                            >
                                Sign Up
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full"
                                onClick={async () => {
                                    await login(username, pass)
                                        .then(async (retVal) => {
                                            if (retVal.loginSuccess == true) {
                                                if (retVal.twoFAverif == true) {
                                                    set2fa(true)
                                                    setError({
                                                        b: false
                                                    })
                                                } else {
                                                    const token = retVal.response.token
                                                    localStorage.setItem('token', token)
                                                    localStorage.setItem('username', username)
                                                    await vaultFetch(username, token).then((vault) => {
                                                        setView('dashboard')
                                                        setPass('')
                                                        setName('')
                                                    }).catch((e) => {
                                                        setError({
                                                            b: true,
                                                            message: e.response.error
                                                        })
                                                    })
                                                }
                                            }
                                        })
                                        .catch((e) => {
                                            setError({
                                                b: true,
                                                message: e.response.error
                                            })
                                        })
                                }}
                            >
                                Login
                            </Button>
                        )}
                        {loginShow == true && (
                            <a
                                href="#"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        )}
                    </CardFooter>
                </Card>
            )}
        </ThemeProvider>
    )
}

export { Login }
