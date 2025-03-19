"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDown,
  Globe,
  Pencil,
  Loader2,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddDomainDialog from "@/components/dashboard/AddDomainDialog";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { SelectUser, users } from "@/db/schema";
import { getServerSideProps } from "next/dist/build/templates/pages";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DomainsPage({
  userDb,
}: {
  userDb: SelectUser;
}) {

  console.log(userDb?.domainVerified);

  const [activeTab, setActiveTab] = useState("a-record");
  const [isOpen, setIsOpen] = useState(true);
  const [verifyDomain, setVerifyDomain] = useState(
    userDb?.domainVerified ? "verified" : "not-verified"
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (userDb?.domainVerified) {
      setVerifyDomain("verified");
    }
  }, [userDb?.domainVerified]);

  const handleVerifyDomain = async () => {
    if (
      verifyDomain === "not-verified" &&
      userDb?.domain &&
      userDb?.domainVerified === false
    ) {
      setVerifyDomain("verifying");

      try {
        const res = await fetch("/api/domains/verify-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userDb?.id,
            customDomain: userDb?.domain,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setVerifyDomain("verified");

          toast({
            title: "Domain verified",
            description: "Your domain has been verified successfully",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    const res = await fetch("/api/domains/delete-domain", {
      method: "POST",
      body: JSON.stringify({
        userId: userDb?.id,
        customDomain: userDb?.domain,
      }),
    });

    if (res.ok) {
      toast({
        title: "Domain deleted",
        description: "Your domain has been deleted successfully",
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar userDb={userDb}/>
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                  Domains
                </h1>

                <AddDomainDialog
                  onDomainAdded={() => {}}
                  userId={userDb?.id || ""}
                  domainVerified={userDb?.domainVerified || false}
                />
              </div>

              <div className="flex flex-col mt-12 items-center gap-4">
                {/* DNS Configuration Card */}
                <Card className="mb-6 w-full">
                  <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="pr-4 sm:pr-6"
                  >
                    <div className="flex flex-row w-full justify-between items-center">
                      <CardHeader>
                        <CardTitle>Configure DNS</CardTitle>
                        <CardDescription>
                          Instructions for configuring your DNS records.
                        </CardDescription>
                      </CardHeader>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9">
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>{" "}
                    </div>
                    <CollapsibleContent className="space-y-2">
                      <CardContent className="pr-0">
                        <Tabs
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="a-record">
                              A Record (recommended)
                            </TabsTrigger>
                            <TabsTrigger value="cname-record">
                              CNAME Record
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="a-record">
                            <div className="mt-4 rounded-md border">
                              <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm">
                                <div>Type</div>
                                <div>Name</div>
                                <div className="col-span-2">Value</div>
                                <div>TTL</div>
                              </div>
                              <div className="grid grid-cols-5 gap-4 border-t bg-muted/50 p-4 text-sm">
                                <div>A</div>
                                <div>@</div>
                                <div className="col-span-2 flex items-center gap-2">
                                  76.76.21.21
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard("76.76.21.21")
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy value</span>
                                  </Button>
                                </div>
                                <div>86400</div>
                              </div>
                            </div>
                            <Alert className="mt-4">
                              <AlertDescription>
                                If a TTL value of 86400 is not
                                available, choose the highest available value.
                                Domain propagation may take up to 12 hours.
                              </AlertDescription>
                            </Alert>
                          </TabsContent>
                          <TabsContent value="cname-record">
                            <div className="mt-4 rounded-md border">
                              <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm">
                                <div>Type</div>
                                <div>Name</div>
                                <div className="col-span-2">Value</div>
                                <div>TTL</div>
                              </div>
                              <div className="grid grid-cols-5 gap-4 border-t bg-muted/50 p-4 text-sm">
                                <div>CNAME</div>
                                <div>@</div>
                                <div className="col-span-2 flex items-center gap-2">
                                  {`cname.veevo.app`}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(`cname.veevo.app`)
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy value</span>
                                  </Button>
                                </div>
                                <div>86400</div>
                              </div>
                            </div>
                            <Alert className="mt-4">
                              <AlertDescription>
                                Note: Some DNS providers may not allow CNAME
                                records for apex domains. In this case, please
                                use the A record configuration.
                              </AlertDescription>
                            </Alert>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>

                {/* Domain List Card */}
                {userDb?.domain && (
                  <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl py-4 px-6 w-full">
                    <div className="flex flex-row items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <p className="font-semibold">{userDb?.domain}</p>
                    </div>
                    <div className="flex flex-row items-center gap-8">
                      <Button
                        onClick={() => {
                          handleVerifyDomain();
                        }}
                        disabled={
                          verifyDomain === "verifying" ||
                          verifyDomain === "verified"
                        }
                        variant="default"
                        className={cn(
                          "px-2 py-1 h-fit rounded-full text-sm flex items-center gap-2.5 min-w-[120px]",
                          verifyDomain === "not-verified" &&
                            "bg-sky-700 hover:bg-sky-800",
                          verifyDomain === "verified" &&
                            "bg-green-100 text-green-700 hover:bg-green-200",
                          verifyDomain === "verifying" &&
                            "bg-sky-700 hover:bg-sky-800"
                        )}
                      >
                        {verifyDomain === "not-verified" && "Verify domain"}
                        {verifyDomain === "verified" && (
                          <div className="flex flex-row items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <p>Verified</p>
                          </div>
                        )}
                        {verifyDomain === "verifying" && (
                          <div className="flex flex-row items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <p>Verifying</p>
                          </div>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-1 rounded-md flex items-center gap-2.5 hover:rounded-2xl"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {/* Edit Product */}
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500 focus:bg-red-50 focus:text-red-600 hover:cursor-pointer"
                            onSelect={(e) => e.preventDefault()} // Prevents closing menu on click
                          >
                            <Dialog
                              open={openDeleteDialog}
                              onOpenChange={setOpenDeleteDialog}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full h-fit p-0 justify-start text-red-500 hover:bg-red-50 hover:text-red-600 hover:cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[350px]">
                                <DialogHeader>
                                  <DialogTitle>Delete Domain</DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="text-sm -mt-2 text-center sm:text-left">
                                  Are you sure you want to delete this domain?
                                  This action is irreversible.
                                </DialogDescription>
                                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-1">
                                  <Button
                                    variant="outline"
                                    onClick={() => setOpenDeleteDialog(false)}
                                  >
                                    No
                                  </Button>
                                  <Button
                                    variant="default"
                                    onClick={() => handleDelete()}
                                  >
                                    Yes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
