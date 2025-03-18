"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

export default function AddDomainDialog({
  onDomainAdded,
  userId,
  domainVerified,
}: {
  onDomainAdded: () => void;
  userId: string;
  domainVerified: boolean;
}) {

  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  
  const handleAddDomain = async () => {
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/domains/add-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          customDomain: domain,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Domain added! Verify it in your DNS provider.",
        });
        onDomainAdded(); // Refresh the domain list
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add domain.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
    setDomain("");
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={domainVerified} variant="outline" className="flex flex-row items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Domain</DialogTitle>
          <DialogDescription>
            Enter your domain and update your DNS settings.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleAddDomain} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Add Domain"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
