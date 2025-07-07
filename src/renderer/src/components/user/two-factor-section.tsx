import * as React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconShield, IconCheck, IconX, IconQrcode, IconCopy } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

// Schema for 2FA setup form
const twoFactorSchema = z.object({
    code: z.string().length(6, '2FA code must be 6 digits')
})

type TwoFactorForm = z.infer<typeof twoFactorSchema>

interface TwoFactorSectionProps {
    twoFactorEnabled: boolean
}

export function TwoFactorSection({ twoFactorEnabled }: TwoFactorSectionProps) {
    const [is2FADialogOpen, setIs2FADialogOpen] = React.useState(false)

    const twoFactorForm = useForm<TwoFactorForm>({
        resolver: zodResolver(twoFactorSchema),
        defaultValues: {
            code: ''
        }
    })

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success('Copied to clipboard')
        } catch (err) {
            toast.error('Failed to copy to clipboard')
        }
    }

    const disable2FA = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Two-factor authentication disabled')
        } catch (error) {
            toast.error('Failed to disable 2FA')
        }
    }

    const onTwoFactorSubmit = async (_data: TwoFactorForm) => {
        try {
            // Simulate API call to verify 2FA code
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            toast.success('Two-factor authentication enabled successfully')
            twoFactorForm.reset()
            setIs2FADialogOpen(false)
        } catch (error) {
            toast.error('Invalid 2FA code')
        }
    }

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg gap-3">
            <div className="space-y-2">
                <div className="flex-col items-center gap-2">
                    <p className="font-medium">Two-Factor Auth</p>
                    {twoFactorEnabled ? (
                        <Badge
                            variant="default"
                            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                        >
                            <IconCheck className="size-3 mr-1" />
                            Enabled
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                            <IconX className="size-3 mr-1" />
                            Disabled
                        </Badge>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account with authenticator apps like Google
                        Authenticator, Authy, or 1Password.
                    </p>
                </div>
            </div>
            <div className="sm">
                {twoFactorEnabled ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={disable2FA}
                        className="w-full sm:w-auto"
                    >
                        Disable
                    </Button>
                ) : (
                    <Dialog
                        open={is2FADialogOpen}
                        onOpenChange={setIs2FADialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                <IconShield className="size-4 mr-2" />
                                Enable
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    Enable Two-Factor Authentication
                                </DialogTitle>
                                <DialogDescription>
                                    Scan the QR code with your authenticator app and enter the
                                    verification code
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="p-4 border rounded-lg bg-white">
                                        <IconQrcode className="size-32 text-muted-foreground" />
                                    </div>
                                </div>
                                <Alert>
                                    <AlertDescription>
                                        Manual entry key: ABCD-EFGH-IJKL-MNOP
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 h-auto p-1"
                                            onClick={() =>
                                                copyToClipboard('ABCD-EFGH-IJKL-MNOP')
                                            }
                                        >
                                            <IconCopy className="size-3" />
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                                <Form {...twoFactorForm}>
                                    <form
                                        onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={twoFactorForm.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Verification Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="123456"
                                                            {...field}
                                                            className="text-center text-lg font-mono"
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter the 6-digit code from your authenticator app
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIs2FADialogOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit">
                                                Enable 2FA
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    )
}
