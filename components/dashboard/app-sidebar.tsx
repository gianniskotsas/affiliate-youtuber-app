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

const data = {
  projects: [
    {
      name: "Videos",
      url: "/dashboard",
      icon: "Video",
    },
    {
      name: "Products",
      url: "#",
      icon: "Package",
    },
    {
      name: "Profile",
      url: "/dashboard/profile",
      icon: "User",
    },
    {
      name: "Analytics",
      url: "#",
      icon: "ChartBar",
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
                  <GalleryVerticalEnd className="size-4" />
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
