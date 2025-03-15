"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUserDb } from "@/context/UserDbContext";
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
import { ChevronsUpDown, Plus } from "lucide-react";
import { Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DNSConfigurationGuideProps {
  aRecord: {
    type: string;
    name: string;
    value: string;
    ttl: string;
  };
}

export default function DomainsPage({
  aRecord = {
    type: "A",
    name: "@",
    value: "76.76.21.21",
    ttl: "86400",
  },
}: DNSConfigurationGuideProps) {
  const { userDb } = useUserDb();

  const [activeTab, setActiveTab] = useState("a-record");
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                  Domains
                </h1>
                <Button variant={"outline"}>
                  <div className="flex flex-row items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Domain
                  </div>
                </Button>
              </div>

              <div className="flex flex-col mt-12 items-center gap-4">
                <Card className="mb-6 w-full">
                  <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="pr-2 sm:pr-8"
                  >
                    <div className="flex flex-row w-full justify-between items-center">
                      <CardHeader>
                        <CardTitle>Configure DNS</CardTitle>
                        <CardDescription>
                          To configure your domain, set the following
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
                                <div>{aRecord.type}</div>
                                <div>{aRecord.name}</div>
                                <div className="col-span-2 flex items-center gap-2">
                                  {aRecord.value}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(aRecord.value)
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy value</span>
                                  </Button>
                                </div>
                                <div>{aRecord.ttl}</div>
                              </div>
                            </div>
                            <Alert className="mt-4">
                              <AlertDescription>
                                If a TTL value of {aRecord.ttl} is not
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
                                <div>{aRecord.ttl}</div>
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

                <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl py-4 px-6 w-full">
                  <p className="font-semibold">veevo.link</p>
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
