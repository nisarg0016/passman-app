import { Button } from '@/components/ui/button'
import * as React from "react"
import { AppSidebar } from '@/components/app-sidebar'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { vaultFetch } from '@/lib/api/landing'

type LoginProps = {
    setView: (view: string) => void
}

function Dashboard({ setView }: LoginProps) {
    const data = localStorage.getItem('vault') ? JSON.parse(localStorage.getItem('vault') || '') : []
    return (
        <div className="w-full">
            <SidebarProvider className="w-full">
                <div className="flex flex-row w-full">
                    <AppSidebar setView = {setView} variant="inset" collapsible="icon" />
                    <SidebarInset className="flex-1 max-w-full h-screen overflow-auto py-6">
                        <SiteHeader />
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-4 py-6 px-6">
                                <DataTable data={data} />
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
        // <Button type="register" className="w-full" onClick={() => setView('login')}>
        //     :D
        // </Button>
    )
}

export { Dashboard }