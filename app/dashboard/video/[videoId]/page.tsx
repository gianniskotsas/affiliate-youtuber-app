"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AddVideoModal from "@/components/dashboard/create-video-button";
import { SelectProduct } from "@/db/schema"; // Import Drizzle ORM product type
import MockupPage from "@/components/dashboard/iphone-mockup";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, QrCode, Trash2 } from "lucide-react";

export default function EditVideoPage() {
  const router = useRouter();
  const { videoId } = useParams();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [video, setVideo] = useState(null);
  const [products, setProducts] = useState<SelectProduct[]>([]); // ✅ Drizzle ORM typing

  // Fetch video details
  useEffect(() => {
    if (videoId) {
      fetch(`/api/videos/fetch-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      })
        .then((res) => res.json())
        .then((data) => setVideo(data))
        .catch((error) => console.error("Failed to fetch video:", error));
    }
  }, [videoId]);

  // Fetch products for the video
  useEffect(() => {
    if (videoId) {
      fetch(`/api/videos/fetch-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      })
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Failed to fetch products:", error));
    }
  }, [videoId]);

  if (!videoId) return <div>Invalid video ID</div>;
  if (!userId) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                Edit Video Page
              </h1>

              <section className="flex flex-col p-4 gap-4">
                <h2 className="text-lg font-bold">Manage Affiliate Products</h2>
                <p className="text-sm text-gray-600">
                  Add, edit, and remove affiliate products from your video.
                </p>

                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-2xl shadow-sm p-4 relative flex flex-col sm:flex-row items-start w-[400px] sm:w-[600px] sm:items-center gap-12"
                    >
                      {product.imageUrl && (
                        <div className="flex-shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.productName}
                            quality={40}
                            className="w-[80px] sm:w-[120px] rounded-md"
                            width={80}
                            height={120}
                          />
                        </div>
                      )}

                      <div className="flex flex-col justify-between max-h-[85px] sm:max-h-[140px]">
                        <div className="flex flex-col items-start gap-2">
                          <Button
                            variant="secondary"
                            className="p-2 rounded-md flex items-center gap-2.5"
                            onClick={() => navigator.clipboard.writeText(product.shortLink)}
                          >
                            <p className="text-sm text-neutral-700 font-semibold">
                              {product.shortLink}
                            </p>
                          </Button>
                          <Link
                            className="ml-2 text-xs text-gray-600 hover:underline flex flex-row items-center gap-1"
                            href={product.originalLink}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
                            </svg>
                            <span>{product.originalLink}</span>
                          </Link>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-1 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Pencil size={16} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <QrCode size={16} /> Get QR
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600">
                              <Trash2 size={16} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No affiliate products available.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}