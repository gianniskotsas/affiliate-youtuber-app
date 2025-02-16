"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SelectUser } from "@/db/schema";
import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import React from "react";
import { social } from "@/lib/utils";
import { IconType } from "react-icons/lib";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProfileImageUpload from "@/components/dashboard/ProfileImageUpload";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  bio: z.string().max(160),
  socialAccounts: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required." }),
        url: z.string(),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditVideoPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { toast } = useToast();
  const { user } = useUser();
  const [userDb, setUserDb] = useState<SelectUser | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      username: userDb?.username ?? "", // Ensures empty string if undefined
      email: userDb?.email ?? "",
      bio: userDb?.bio ?? "",
      socialAccounts: userDb?.socialAccounts ?? [],
    },
  });

  const { fields, append } = useFieldArray({
    name: "socialAccounts",
    control: form.control,
  });

  useEffect(() => {
    if (isLoaded && userId && user) {
      setLoading(true);
      fetch("/api/user/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username ?? user.firstName,
          profilePicture: user.imageUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserDb(data);
          setProfileImage(data.profilePicture);
          console.log(data);
          form.reset({
            username: data.username ?? "",
            email: data.email ?? "",
            bio: data.bio ?? "",
            socialAccounts: Array.isArray(data.socialAccounts)
              ? data.socialAccounts
              : [],
          });
        })
        .catch((error) => console.error("Failed to fetch user:", error))
        .finally(() => setLoading(false));
    }
  }, [isLoaded, userId, user]);

  // Sync state when `userDb.profilePicture` updates (e.g., after re-fetch)
  useEffect(() => {
    if (userDb?.profilePicture) {
      setProfileImage(userDb.profilePicture);
    }
    console.log(userDb?.profilePicture);
  }, [userDb?.profilePicture]);

  if (!isLoaded) return <div>Loading...</div>;

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch("/api/user/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, // Ensure you have access to the logged-in user's ID
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();

      // Display success toast with a checkmark icon
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      toast({
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoaded && userId && user) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-sidebar md:pt-1.5">
          <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
            <div className="bg-sidebar md:bg-white">
              <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
                <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                  Profile
                </h1>
                {!loading && (
                  <div>
                    <ProfileImageUpload
                      userId={userId}
                      existingImage={profileImage}
                    />

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8 max-w-md"
                      >
                        <div className="flex flex-row items-center space-x-2 w-full">
                          <div className="flex-grow">
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="shadcn"
                                      {...field}
                                      data-disabled="true" // ✅ Store disabled state in an attribute
                                      disabled={
                                        document
                                          .querySelector("#username-input")
                                          ?.getAttribute("data-disabled") ===
                                        "true"
                                      }
                                      id="username-input"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-center h-full">
                            <Button
                              className={cn(
                                document
                                  .querySelector("#username-input")
                                  ?.getAttribute("data-disabled") !== "true" &&
                                  "hidden",
                                "mt-8 px-2.5 aspect-square border-none"
                              )}
                              onClick={(e) => {
                                e.preventDefault(); // Prevents form auto-submission
                                const input = document.querySelector(
                                  "#username-input"
                                ) as HTMLElement;
                                if (input) {
                                  const isDisabled =
                                    input.getAttribute("data-disabled") ===
                                    "true";
                                  input.setAttribute(
                                    "data-disabled",
                                    isDisabled ? "false" : "true"
                                  );
                                  input.toggleAttribute("disabled");
                                  if (!isDisabled) {
                                    e.currentTarget.classList.add("hidden");
                                  }
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-row items-center space-x-2 w-full">
                          <div className="flex-grow">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="example@example.com"
                                      {...field}
                                      data-disabled="true" // ✅ Store disabled state in an attribute
                                      disabled={
                                        document
                                          .querySelector("#email-input")
                                          ?.getAttribute("data-disabled") ===
                                        "true"
                                      }
                                      id="email-input"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-center h-full">
                            <Button
                              className={cn(
                                document
                                  .querySelector("#email-input")
                                  ?.getAttribute("data-disabled") !== "true" &&
                                  "hidden",
                                "mt-8 px-2.5 aspect-square border-none"
                              )}
                              onClick={(e) => {
                                e.preventDefault(); // Prevents form auto-submission
                                const input = document.querySelector(
                                  "#email-input"
                                ) as HTMLElement;
                                if (input) {
                                  const isDisabled =
                                    input.getAttribute("data-disabled") ===
                                    "true";
                                  input.setAttribute(
                                    "data-disabled",
                                    isDisabled ? "false" : "true"
                                  );
                                  input.toggleAttribute("disabled");
                                  if (!isDisabled) {
                                    e.currentTarget.classList.add("hidden");
                                  }
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us a little bit about yourself"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div>
                          {userDb?.socialAccounts?.map((account, index) => (
                            <FormField
                              key={account.name}
                              control={form.control}
                              name={`socialAccounts.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    className={cn(index !== 0 && "sr-only")}
                                  >
                                    Social Accounts
                                  </FormLabel>
                                  <FormControl>
                                    <div className="flex flex-row items-center h-9 w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                                      <div className="w-10 h-full flex items-center justify-center bg-neutral-200 rounded-l-md">
                                        {social.find(
                                          (s) => s.name === account.name
                                        )?.icon &&
                                          React.createElement(
                                            social.find(
                                              (s) => s.name === account.name
                                            )!.icon,
                                            {
                                              className: "size-4 text-gray-500",
                                            }
                                          )}
                                      </div>
                                      <Input
                                        defaultValue={account.url}
                                        {...field}
                                        className="focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <Button type="submit">Update profile</Button>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
}
