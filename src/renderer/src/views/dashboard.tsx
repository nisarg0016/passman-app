import * as React from "react"
import { AppSidebar } from '@/components/app-sidebar'
import { DataTable } from '@/components/data-table'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

type LoginProps = {
    setView: (view: string) => void
}

function Dashboard({ setView }: LoginProps) {
    const [vaultData, setVaultData] = React.useState(() => {
        const data = localStorage.getItem('vault') ? JSON.parse(localStorage.getItem('vault') || '') : []
        return data
    })

    const refreshVaultData = React.useCallback(() => {
        const data = localStorage.getItem('vault') ? JSON.parse(localStorage.getItem('vault') || '') : []
        setVaultData(data)
    }, [vaultData])

    React.useEffect(() => {
    }, [vaultData])

    return (
        <div className="w-full">
            <SidebarProvider className="w-full">
                <div className="flex flex-row w-full">
                    <AppSidebar setView={setView} refreshVaultData={refreshVaultData} variant="inset" collapsible="icon" />
                    <SidebarInset className="flex-1 max-w-full h-screen overflow-auto py-6">
                        <SiteHeader />
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-4 py-6 px-6">
                                <DataTable data={vaultData} />
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}

export { Dashboard }