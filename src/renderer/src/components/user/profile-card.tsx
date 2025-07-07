import * as React from 'react'
import { IconUser } from '@tabler/icons-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileCardProps {
    user: {
        username: string
        email: string
        memberSince: string
    }
}

export function ProfileCard({ user }: ProfileCardProps) {
    const memberSinceDate = new Date(parseInt(user.memberSince) * 1000)
    let formattedDate = memberSinceDate.toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric"})
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconUser className="size-5" />
                    Profile Information
                </CardTitle>
                <CardDescription>Your account details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Username</Label>
                    <div className="h-2"></div>
                    <Input value={user.username} readOnly className="bg-muted/50" />
                </div>
                <div className="h-3"></div>
                <div>
                    <Label>Email</Label>
                    <div className="h-2"></div>
                    <Input value={user.email} readOnly className="bg-muted/50" />
                </div>
                <div className="h-3"></div>
                <div>
                    <Label>Member Since</Label>
                    <div className="h-2"></div>
                    <Input
                        value={formattedDate}
                        readOnly
                        className="bg-muted/50"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

