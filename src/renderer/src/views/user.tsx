import * as React from 'react'

import { Button } from '@/components/ui/button'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ProfileCard, SecurityCard, BackupCodesCard } from '@/components/user'

type UserProps = {
    setView: (view: string) => void
}

function User({ setView }: UserProps) {
    const [user] = React.useState({
        username: localStorage.getItem('username') || 'john.doe',
        email: localStorage.getItem('email') || 'No email provided',
        twoFactorEnabled: localStorage.getItem('twoFactorEnabled') === 'true',
        memberSince: localStorage.getItem('created_at') || Math.floor(Date.now() / 1000)
    })
    
    const [backupCodes] = React.useState([
        'ABC123DEF456',
        'GHI789JKL012',
        'MNO345PQR678',
        'STU901VWX234',
        'YZA567BCD890'
    ])

    return (
        <div className="w-full">
            <SidebarProvider className="w-full">
                <div className="flex flex-row w-full">
                    <AppSidebar setView={setView} variant="inset" collapsible="icon" />
                    <SidebarInset className="flex-1 max-w-full h-screen overflow-auto py-6">
                        <SiteHeader />
                        <div className="flex flex-col gap-6 p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-bold">Account Settings</h1>
                                    <p className="text-muted-foreground">
                                        Manage your account security and preferences
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setView('dashboard')
                                        localStorage.setItem('view', 'dashboard')
                                    }}
                                    className="shrink-0"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <ProfileCard user={user} />
                                <SecurityCard twoFactorEnabled={user.twoFactorEnabled} />
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}

export { User }
