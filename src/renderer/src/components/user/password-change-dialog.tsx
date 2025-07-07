import * as React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconKey, IconEye, IconEyeOff } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

// Schema for password change form
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>

export function PasswordChangeDialog() {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false)

    const passwordForm = useForm<PasswordChangeForm>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onPasswordSubmit = async (_data: PasswordChangeForm) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            toast.success('Password changed successfully')
            passwordForm.reset()
            setIsPasswordDialogOpen(false)
        } catch (error) {
            toast.error('Failed to change password')
        }
    }

    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                    Change your account password
                </p>
            </div>
            <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            >
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <IconKey className="size-4 mr-2" />
                        Change
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new one
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() =>
                                                        setShowCurrentPassword(!showCurrentPassword)
                                                    }
                                                >
                                                    {showCurrentPassword ? (
                                                        <IconEyeOff className="size-4" />
                                                    ) : (
                                                        <IconEye className="size-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() =>
                                                        setShowNewPassword(!showNewPassword)
                                                    }
                                                >
                                                    {showNewPassword ? (
                                                        <IconEyeOff className="size-4" />
                                                    ) : (
                                                        <IconEye className="size-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Must be at least 8 characters long
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                >
                                                    {showConfirmPassword ? (
                                                        <IconEyeOff className="size-4" />
                                                    ) : (
                                                        <IconEye className="size-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsPasswordDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Change Password
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
