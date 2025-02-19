"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AddVideoModal from "@/components/dashboard/create-video-button";
import { SelectProduct, SelectVideo } from "@/db/schema";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MockupPage from "@/components/dashboard/iphone-mockup";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, QrCode, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QrCodeModal from "@/components/dashboard/qr-code-modal";

export default function EditVideoPage() {
  const router = useRouter();
  const { videoId } = useParams();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [video, setVideo] = useState<SelectVideo | null>(null);
  const [products, setProducts] = useState<SelectProduct[]>([]);
  const { toast } = useToast();

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
      fetch(`/api/products/get-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      })
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Failed to fetch products:", error));
    }
  }, [videoId]);

  if (!video) return <div>Loading...</div>; 
  if (!videoId) return <div>Invalid video ID</div>;
  if (!userId) return null;

  const handleDelete = async (product: SelectProduct) => {
    try {
      const response = await fetch("/api/products/delete-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      if (response.ok) {
        // Handle success (e.g., refresh the products list, show a toast, etc.)
        toast({
          title: "Product deleted successfully",
          description: "The product has been removed from your video.",
        });

        // Refetch products from the database
        const productsResponse = await fetch(`/api/products/get-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });

        if (productsResponse.ok) {
          const updatedProducts = await productsResponse.json();
          setProducts(updatedProducts);
        } else {
          console.error("Failed to refetch products");
        }
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
              <div className="flex flex-row gap-16 h-full mt-8">
                <div className="w-full">
                  <div className="flex flex-col gap-8">
                    {/* Profile Editing Section */}
                    <section className="p-4 bg-white rounded-md shadow transition">
                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold">Edit Profile</h2>
                          <p className="text-sm text-gray-600">
                            Update your profile details and social media links.
                          </p>
                        </div>
                        <Link
                          href="/dashboard/profile"
                          className={cn(
                            buttonVariants({
                              variant: "default",
                            }),
                            "mt-2 sm:mt-0  px-4 py-2 rounded-md transition min-w-[150px]"
                          )}
                        >
                          <div className="flex items-center gap-2 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Go to Profile
                          </div>
                        </Link>
                      </div>
                    </section>

                    {/* QR Code Section */}
                    <section className="p-4 bg-white rounded-md shadow transition">
                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold">QR Code</h2>
                          <p className="text-sm text-gray-600">
                            Generate a QR code for your profile.
                          </p>
                        </div>
                        <QrCodeModal
                          url={video?.videoShortLink}
                          videoId={videoId as string}
                        />
                      </div>
                    </section>

                    {/* Affiliate Products Section */}
                    <section className="flex flex-col p-4 gap-4">
                      {/* Container for managing affiliate products */}
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold">
                          Manage Affiliate Products
                        </h2>
                        <p className="text-sm text-gray-600">
                          Add, edit, and remove affiliate products from your
                          video.
                        </p>
                      </div>

                      {/* Container for affiliate product cards */}
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
                              {/* Container for product link */}
                              <div className="flex flex-col items-start gap-2">
                                <Button
                                  variant="outline"
                                  className="p-2 rounded-md flex items-center gap-2.5 group bg-sky-50 hover:bg-sky-100"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      product.shortLink
                                    );
                                    // Show toaster notification

                                    navigator.clipboard.writeText(
                                      product.shortLink
                                    );
                                    // Show toaster notification
                                    toast({
                                      title: "Link copied to clipboard!",
                                      description:
                                        "You can now paste it into your youtube description or share it with others.",
                                    });
                                  }}
                                >
                                  <p className="text-sm text-neutral-700 font-semibold">
                                    {product.shortLink}
                                  </p>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6 hidden group-hover:inline-block"
                                  >
                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                                    <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                                  </svg>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 block group-hover:hidden"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                    />
                                  </svg>
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
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
                                    />
                                  </svg>
                                  <span>{product.originalLink}</span>
                                </Link>
                              </div>
                            </div>

                            <div className="absolute top-2 right-2">
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
                                  <DropdownMenuItem>
                                    <Pencil size={16} />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <QrCode size={16} /> Get QR
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="text-red-500 focus:bg-red-50 focus:text-red-600"
                                    onSelect={(e) => e.preventDefault()} // Prevents closing menu on click
                                    onClick={() => handleDelete(product)}
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">
                          No affiliate products available.
                        </p>
                      )}
                    </section>
                  </div>
                </div>
                <MockupPage products={products} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
