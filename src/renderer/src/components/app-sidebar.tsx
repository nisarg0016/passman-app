import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

type LoginProps = {
    setView: (view: string) => void
}

type AppSidebarProps = {
    setView: LoginProps
    refreshVaultData?: () => void
}

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({setView, refreshVaultData, ...props }: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  const data = {
      user: {
          name: localStorage.getItem('username') || 'Nisarg Desai',
          email: localStorage.getItem('email') || 'hi@example.com',
          avatar: localStorage.getItem('ppic') || '/avatars/shadcn.jpg'
      },
      navMain: [
          {
              title: 'Dashboard',
              url: '#',
              icon: IconDashboard,
              function: () => {setView('dashboard')}
          }
      ],
      navSecondary: [
          {
              title: 'Settings',
              url: '#',
              icon: IconSettings,
              function: () => {setView('user')}
          },
          {
              title: 'Search',
              url: '#',
              icon: IconSearch
          }
      ]
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Passman</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} setView={setView} refreshVaultData={refreshVaultData} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser setView = {setView} user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
