import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInput } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  featureRequest: z.string().min(5, {
    message: "Feature request must be at least 5 characters long",
  }),
});

export default function SidebarFeatureRequestForm({
  email,
}: {
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featureRequest: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const response = await fetch("/api/resend/send-feature-request", {
      method: "POST",
      body: JSON.stringify({
        userEmail: email,
        featureRequestText: values.featureRequest,
      }),
    });

    if (response.ok) {
      setIsOpen(false);
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="border rounded-xl p-2"
        >
          <CollapsibleTrigger asChild>
            <button className="w-full" onClick={() => setIsOpen(!isOpen)}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 justify-start w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-amber-400"
                  >
                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                    <path
                      fillRule="evenodd"
                      d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="text-sm font-">Feature request</p>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(
              isOpen &&
                "flex flex-col gap-2 mt-2.5 transition-all duration-300",
              !isOpen && "hidden"
            )}
          >
            <FormField
              control={form.control}
              name="featureRequest"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    className="resize-none min-h-24"
                    placeholder="I would like to see..."
                    {...field}
                  />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
              size="sm"
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <p>Send</p>
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
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </div>
              )}
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </Form>
  );
}
