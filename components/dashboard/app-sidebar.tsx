import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { SidebarOptInForm } from "@/components/dashboard/sidebar-opt-in-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  projects: [
    {
      name: "Videos",
      url: "#",
      icon: "Frame"
    },
    {
      name: "Products",
      url: "#",
      icon: "PieChart"
    },
    {
      name: "Analytics",
      url: "#",
      icon: "Map"
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
