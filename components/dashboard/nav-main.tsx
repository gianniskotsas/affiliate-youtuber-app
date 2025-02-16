"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Frame,
  PieChart,
  Map,
  Package,
  Video,
  User,
  ChartBar,
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
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

  console.log("pathname is: ",pathname)

  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const icons = {
      Frame,
      PieChart,
      Map,
      User,
      Folder,
      Forward,
      ChartBar,
      MoreHorizontal,
      Trash2,
      Video,
      Package,
    }
    return icons[iconName as keyof typeof icons]
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-4">
      <SidebarMenu>
        {projects.map((item) => {
          const IconComponent = getIcon(item.icon)
          const isActive = (pathname === "/dashboard" && item.url === "/dashboard") || pathname === `/dashboard/${item.name.toLowerCase()}` || (item.url === "/dashboard" && pathname.startsWith("/dashboard/video/"))
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link 
                  href={item.url} 
                  className={isActive ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                >
                  <IconComponent />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}