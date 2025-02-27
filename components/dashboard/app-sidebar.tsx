import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { NavMain } from "@/components/dashboard/nav-main";
import { SidebarOptInForm } from "@/components/dashboard/sidebar-opt-in-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
const data = {
  projects: [
    {
      name: "Videos",
      url: "/dashboard",
      icon: "Video",
      active: true,
    },
    {
      name: "Profile",
      url: "/dashboard/profile",
      icon: "User",
      active: true,
    },
    {
      name: "Sell merch",
      url: "#",
      icon: "Shirt",
      active: false,
    },    
    {
      name: "Analytics",
      url: "#",
      icon: "ChartBar",
      active: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex justify-between items-center hover:bg-transparent focus:bg-transparent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/veevo_logo_dark.jpg" alt="Logo" width={16} height={16} className="size-6" />
                </div>
                <div className="flex border border-neutral-800 rounded-full justify-center items-center">
                  <UserButton />
                </div>
              </div>
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
  );
}
