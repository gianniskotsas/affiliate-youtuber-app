"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IPhoneMockup } from "react-device-mockup";
import { SpotlightNew } from "@/components/ui/spotlight-new";
import Link from "next/link";
import { CornerRightDown, CornerLeftDown } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WaitlistPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const { toast } = useToast();

  const handleSubmit = (values: FormValues) => {
    console.log("Email submitted:", values.email);

    fetch('/api/waitlist/join-waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: values.email }),
    })
      .then(response => response.json())
      .then(data => {
        toast({
          title: "Email Submitted",
          description: `You have entered: ${values.email}`,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen px-2.5 h-screen bg-neutral-900 overflow-hidden pt-24">
      <div className="flex flex-col items-center">
        <SpotlightNew />
        <h1 className="text-3xl sm:text-6xl text-neutral-100 font-bold mb-4 max-w-screen-lg text-center">
          Showcase your affiliate products with a dedicated video page
        </h1>
        <p className="text-lg text-neutral-400 mb-8 text-center max-w-screen-sm">
          Create a platform to showcase all your products and redirect your users there either via QR code or via a shortlink.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="bg-neutral-800 text-neutral-100 py-1 px-1.5 border border-neutral-200/40 rounded-lg shadow-md sm:w-[400px] w-full flex gap-4"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="border-none focus:ring-0 shadow-none focus:border-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="rounded-lg bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
            >
              Join waitlist
            </Button>
          </form>
        </Form>
      </div>

      <div className="w-full relative max-w-screen-lg h-1/3 sm:h-1/2 p-3 bg-neutral-100/80 rounded-t-xl">
        <div className="absolute -top-16 left-12 flex flex-row gap-2 items-center animate-bounce rotate-45">
          <Link
            href="https://veevo.app/kotsas/brand-tools"
            className="bg-neutral-100 flex flex-row gap-2 items-center rounded-xl px-2 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>{" "}
            <p>
              <span className="text-neutral-600">veevo.link/</span>
              <span className="text-neutral-600 font-semibold">kotsas</span>
            </p>
          </Link>
          <CornerRightDown className="size-6 mt-4 text-neutral-100" />
        </div>
        <div className="absolute -top-24 right-16 flex flex-row gap-2 items-center animate-bounce rotate-45">
        <CornerLeftDown className="size-6 mt-4 text-neutral-100" />

          <Link
            href="https://veevo.app/kotsas/brand-tools"
            className="bg-neutral-100 flex flex-row gap-2 items-center rounded-full"
          >
            <Image
              src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/kotsas_qr.png"
              alt="Affilify"
              width={60}
              height={60}
              className=""
            />
          </Link>
        </div>
        <Image
          src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/Screenshot%202025-02-26%20at%2019.38.00.png"
          alt="Affilify"
          width={1920}
          height={1080}
          className="rounded-t-xl"
        />
      </div>
    </div>
  );
}
