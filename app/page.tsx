"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function WaitlistPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Email submitted:", values.email);
    // Add your form submission logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 max-w-screen-sm text-center">Track your affiliate product performance</h1>
      <p className="text-lg text-gray-500 mb-8 text-center max-w-screen-sm">
        Create a dedicated video page to showcase all your products and redirect your users there either via QR code or via a shortlink.
      </p>
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-screen-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center space-x-4">
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field} 
                    className="border-none focus:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="rounded-lg">Join waitlist</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

