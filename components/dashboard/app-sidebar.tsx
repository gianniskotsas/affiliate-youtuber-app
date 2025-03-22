"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { NavMain } from "@/components/dashboard/nav-main";

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
import { SelectUser } from "@/db/schema";
import { useUserDb } from "@/context/UserDbContext";
import { getUserById } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import SidebarFeatureRequestForm from "./sidebar-feature-request";
import SidebarContactRequestForm from "./sidebar-contact-request";

export function AppSidebar({
  userDb,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userDb: SelectUser }) {
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
        name: "Analytics",
        url: "/dashboard/analytics",
        icon: "ChartBar",
        active: userDb?.stripeSubscriptionStatus ? true : false,
      },
      {
        name: "Billing",
        url: "/dashboard/billing",
        icon: "CreditCard",
        active: userDb?.stripeSubscriptionStatus ? true : false,
      },
      {
        name: "Domains",
        url: "/dashboard/domains",
        icon: "Globe",
        active: true,
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex justify-between items-center hover:bg-transparent focus:bg-transparent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/veevo_logo_dark.jpg"
                    alt="Logo"
                    width={16}
                    height={16}
                    className="size-6"
                  />
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
        <div className="p-1 flex flex-col gap-2">
          <SidebarContactRequestForm email={userDb?.email} />

          <SidebarFeatureRequestForm email={userDb?.email} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
