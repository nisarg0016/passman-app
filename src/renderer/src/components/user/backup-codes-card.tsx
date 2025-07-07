import * as React from 'react'
import { toast } from 'sonner'
import { IconCopy } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BackupCodesCardProps {
    backupCodes: string[]
}

export function BackupCodesCard({ backupCodes }: BackupCodesCardProps) {
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success('Copied to clipboard')
        } catch (err) {
            toast.error('Failed to copy to clipboard')
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Backup Codes</CardTitle>
                <CardDescription>
                    Use these codes to access your account if you lose your
                    authenticator device. Each code can only be used once.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {backupCodes.map((code, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-2 border rounded font-mono text-sm"
                        >
                            <span className="flex-1">{code}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                onClick={() => copyToClipboard(code)}
                            >
                                <IconCopy className="size-3" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                        Download Codes
                    </Button>
                    <Button variant="outline" size="sm">
                        Generate New Codes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
