import * as React from 'react'
import { IconShield } from '@tabler/icons-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordChangeDialog } from './password-change-dialog'
import { TwoFactorSection } from './two-factor-section'

interface SecurityCardProps {
    twoFactorEnabled: boolean
}

export function SecurityCard({ twoFactorEnabled }: SecurityCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconShield className="size-5" />
                    Security Settings
                </CardTitle>
                <CardDescription>
                    Manage your account security options
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <PasswordChangeDialog />
                <TwoFactorSection twoFactorEnabled={twoFactorEnabled} />
            </CardContent>
        </Card>
    )
}
