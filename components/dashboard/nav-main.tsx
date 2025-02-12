"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Frame,
  PieChart,
  Map,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: string
  }[]
}) {
  const { isMobile } = useSidebar()

  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const icons = {
      Frame,
      PieChart,
      Map,
      Folder,
      Forward,
      MoreHorizontal,
      Trash2,
    }
    return icons[iconName as keyof typeof icons]
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => {
          const IconComponent = getIcon(item.icon)
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <IconComponent />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
   
            </SidebarMenuItem>
          )
        })}
       
      </SidebarMenu>
    </SidebarGroup>
  )
}
