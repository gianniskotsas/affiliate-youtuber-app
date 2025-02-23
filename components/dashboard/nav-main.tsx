"use client";

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
  Shirt,
  ChartBar,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
export function NavMain({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: string;
    active: boolean;
  }[];
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

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
      Shirt,
    };
    return icons[iconName as keyof typeof icons];
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-4">
      <SidebarMenu>
        {projects.map((item) => {
          const IconComponent = getIcon(item.icon);
          const isActive =
            (pathname === "/dashboard" && item.url === "/dashboard") ||
            pathname === `/dashboard/${item.name.toLowerCase()}` ||
            (item.url === "/dashboard" &&
              pathname.startsWith("/dashboard/video/"));
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={cn(
                    "flex flex-row justify-between",
                    item.active ? "" : "text-neutral-400 hover:text-neutral-400 hover:bg-neutral-100 focus:text-neutral-400 focus:bg-neutral-100 cursor-default ",
                    isActive ? "bg-sky-100 text-sky-800 hover:bg-sky-200" : ""
                  )}
                >
                  <div className="flex flex-row items-center gap-2">
                    <IconComponent size={16} />
                    <span>{item.name}</span>
                  </div>
                  {!item.active && (
                    <Badge
                      variant={"outline"}
                      className="text-neutral-500 font-medium bg-neutral-100"
                    >
                      Coming soon
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
