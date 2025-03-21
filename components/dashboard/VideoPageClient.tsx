"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { SelectProduct, SelectVideo, SelectUser } from "@/db/schema";
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
import { Pencil, QrCode, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QrCodeModal from "@/components/dashboard/qr-code-modal";
import CreateProductButton from "@/components/dashboard/create-product-button";
import UpdateProductButton from "@/components/dashboard/update-product-button";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConfettiExplosion, { ConfettiProps } from "react-confetti-explosion";
import UpgradeModal from "@/components/dashboard/upgradeModal";
import { Loader2 } from "lucide-react";
export default function EditVideoPage({
  videoDb,
  productsDb,
  userDb,
}: {
  videoDb: SelectVideo;
  productsDb: SelectProduct[];
  userDb: SelectUser;
}) {
  const router = useRouter();

  const { videoId } = useParams();

  const [video, setVideo] = useState<SelectVideo | null>(videoDb);
  const [products, setProducts] = useState<SelectProduct[]>(productsDb);
  const { toast } = useToast();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isExploding, setIsExploding] = useState(false); // State for confetti
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const fetchProducts = async () => {
    const productsNew = await fetch(
      `${process.env.APP_URL}/api/products/get-products`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      }
    );
    const productsData = await productsNew.json();
    setProducts(productsData);
  };

  if (!video) return null;
  if (!videoId) return null;

  // Function to update the image URL of a specific product
  const handleImageDelete = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, imageUrl: null } : product
      )
    );
  };

  const handleDeleteVideo = async (video: SelectVideo) => {
    try {
      const response = await fetch("/api/videos/delete-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video }),
      });

      if (response.ok) {
        toast({
          title: "Video deleted successfully",
          description: "The video has been removed from your account.",
        });
        router.push("/dashboard");
      } else {
        console.error("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

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

  const qrModalText = [
    {
      name: "video",
      text: "Place this QR code in your video so your viewers can scan it to access your video affiliate page.",
    },
    {
      name: "product",
      text: "Scan the QR code to visit the affiliate product link.",
    },
  ];

  const smallProps: ConfettiProps = {
    force: 0.4,
    duration: 2200,
    particleCount: 30,
    width: 400,
  };

  return (
    <SidebarProvider>
      <AppSidebar userDb={userDb} />
      <div className="flex flex-col w-full bg-sidebar">
        <SidebarTrigger className="sm:hidden p-6" />
        <SidebarInset className="bg-sidebar md:pt-1.5">
          <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
            <div className="bg-sidebar md:bg-white">
              <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
                <div className="flex flex-row justify-between items-center max-w-screen-sm">
                  <div className="flex flex-row gap-2">
                    <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                      Edit Video Page
                    </h1>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-neutral-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-white text-neutral-700 max-w-xs border border-neutral-200"
                        >
                          <p>
                            Here you can edit the video page. Need to change
                            your profile?{" "}
                            <Link
                              href="/dashboard/profile"
                              onClick={() => router.push("/dashboard/profile")}
                              className="underline"
                            >
                              Learn more
                            </Link>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <UpgradeModal
                    open={openUpgradeModal}
                    setOpen={setOpenUpgradeModal}
                    userId={userDb?.id}
                  />
                  <div className="flex flex-row gap-4 items-center">
                    {video.active && (
                      <div className="flex flex-row gap-1 items-center">
                        <p className="text-sm text-neutral-700 font-medium">
                          Active
                        </p>
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    )}
                    <Button
                      variant={video.active ? "secondary" : "default"}
                      onClick={() => {
                        if (!userDb?.stripeSubscriptionStatus) {
                          setOpenUpgradeModal(true);
                          return;
                        }

                        setPublishLoading(true);

                        const updatedVideo = {
                          ...video,
                          active: !video.active,
                        };

                        fetch(`/api/videos/video-publish`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            videoId: video.id,
                            active: updatedVideo.active,
                          }),
                        })
                          .then((res) =>
                            res.json().then((data) => ({
                              status: res.status,
                              body: data,
                            }))
                          )
                          .then(({ status, body }) => {
                            if (status === 200) {
                              toast({
                                title: "Success",
                                description: `The video has been ${
                                  updatedVideo.active ? "published" : "disabled"
                                } successfully.`,
                              });

                              setPublishLoading(false);
                              setVideo(updatedVideo);

                              if (updatedVideo.active) {
                                setIsExploding(true); // Trigger confetti
                                setTimeout(() => setIsExploding(false), 3000); // Stop confetti after 3 seconds
                              }
                            } else {
                              toast({
                                title: "Error",
                                description:
                                  body.error ||
                                  "There was an issue updating the video status. Please try again later.",
                                variant: "destructive",
                              });
                            }
                          })
                          .catch((error) => {
                            console.error(
                              "Failed to update video status:",
                              error
                            );
                            toast({
                              title: "Error",
                              description:
                                "An unexpected error occurred while updating the video status. Please try again later.",
                              variant: "destructive",
                            });
                          });
                      }}
                      className="min-w-24"
                    >
                      {isExploding && (
                        <Fireworks autorun={{ speed: 5, duration: 250 }} />
                      )}
                      {publishLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : video.active ? (
                        "Disable"
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-row gap-16 h-full mt-8">
                  <div className="w-full">
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-row gap-4">
                        {video.videoThumbnail ? (
                          <div className="flex-shrink-0  w-[180px] h-[100px] rounded-md overflow-hidden flex items-center justify-center">
                            <Image
                              src={video.videoThumbnail}
                              alt={video.videoTitle}
                              quality={40}
                              className="rounded-md object-cover"
                              width={180}
                              height={100}
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 ">
                            <div className="w-[100px] sm:w-[120px] rounded-md bg-neutral-200 sm:h-[67px] h-[56px] flex items-center justify-center text-xs italic">
                              Add an image
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col justify-between max-h-[85px] sm:max-h-[140px]">
                          {/* Container for video link */}
                          <div className="flex flex-col p-2 items-start gap-2">
                            <Button
                              variant="outline"
                              className="rounded-lg flex items-center gap-1.5 group"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  video.videoShortLink
                                );
                                // Show toaster notification
                                toast({
                                  title: "Link copied to clipboard!",
                                  description:
                                    "You can now paste it into your youtube description or share it with others.",
                                });
                              }}
                            >
                              <p className="text-xs sm:text-md  font-medium">
                                Copy page link
                              </p>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6 hidden group-hover:inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
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
                                className="size-6 block group-hover:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                />
                              </svg>
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "rounded-lg flex items-start gap-1.5 group"
                                  )}
                                >
                                  <p className="text-xs sm:text-md text-neutral-700 font-medium ">
                                    Get QR Code
                                  </p>
                                  {/* <QrCode className="text-neutral-600 size-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />{" "} */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="text-neutral-700 size-6 block group-hover:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                                    />
                                  </svg>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6 hidden group-hover:inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {/* Increased size from 48 to 64 */}
                                </Button>
                              </DialogTrigger>
                              <QrCodeModal
                                url={video?.videoShortLink}
                                text={qrModalText[0].text}
                              />
                            </Dialog>
                          </div>
                        </div>
                      </div>

                      {/* Affiliate Products Section */}
                      <section className="flex flex-col gap-4 mt-4 max-w-screen-sm">
                        {/* Container for managing affiliate products */}
                        <div className="flex flex-col">
                          <div className="flex flex-col mb-6">
                            <h2 className="text-lg font-bold">
                              Manage Affiliate Products
                            </h2>
                            <p className="text-sm text-gray-600">
                              Add, edit, and remove affiliate products from your
                              video.
                            </p>
                          </div>
                          <CreateProductButton
                            videoId={videoId as string}
                            onProductAdded={fetchProducts}
                          />
                        </div>

                        {/* Container for affiliate product cards */}
                        {products.length > 0 ? (
                          products.map((product) => (
                            <div
                              key={product.id}
                              className="border rounded-2xl shadow-sm p-4 relative flex flex-row sm:flex-row items-center w-full max-w-screen-sm sm:items-center gap-2 sm:gap-6"
                            >
                              {product.imageUrl ? (
                                <div className="flex-shrink-0 w-[100px] sm:w-[120px] h-[56px] sm:h-[67px] rounded-md overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.productName}
                                    quality={40}
                                    className="rounded-md object-cover"
                                    width={120}
                                    height={67}
                                  />
                                </div>
                              ) : (
                                <div className="flex-shrink-0 ">
                                  <div className="w-[100px] sm:w-[120px] rounded-md bg-neutral-200 sm:h-[67px] h-[56px] flex items-center justify-center text-xs italic">
                                    Add an image
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col justify-between max-h-[85px] sm:max-h-[140px]">
                                {/* Container for product link */}
                                <div className="flex flex-col items-start gap-2">
                                  <Button
                                    variant="outline"
                                    className="px-2 rounded-lg flex items-center gap-1.5 group bg-sky-50 hover:bg-sky-100"
                                    onClick={() => {
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
                                    <p className="text-xs sm:text-md text-neutral-700 font-semibold">
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
                                    className="ml-2 text-xs text-gray-600 hover:underline flex flex-row items-center gap-1 truncate "
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
                                    <span>
                                      {product.originalLink.slice(0, 40)}
                                      {product.originalLink.length > 40
                                        ? "..."
                                        : ""}
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              <div className="absolute top-2 right-2 group">
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
                                      <UpdateProductButton
                                        key={product.id}
                                        videoId={product.videoId}
                                        product={product}
                                        setProduct={(updatedProduct) => {
                                          setProducts((prev) =>
                                            prev.map((p) =>
                                              p.id === updatedProduct.id
                                                ? updatedProduct
                                                : p
                                            )
                                          );
                                        }}
                                        onProductAdded={() =>
                                          console.log("Product updated!")
                                        }
                                      />
                                    </DropdownMenuItem>

                                    {/* Get QR Code */}
                                    <DropdownMenuItem
                                      className="hover:cursor-pointer"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            className="p-0 h-fit"
                                          >
                                            <QrCode size={16} /> Get QR
                                          </Button>
                                        </DialogTrigger>
                                        <QrCodeModal
                                          url={product.shortLink}
                                          text={qrModalText[1].text}
                                        />
                                      </Dialog>
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
                                            <DialogTitle>
                                              Delete Product
                                            </DialogTitle>
                                          </DialogHeader>
                                          <DialogDescription className="text-sm -mt-2 text-center sm:text-left">
                                            Are you sure you want to delete this
                                            product? This action is
                                            irreversible.
                                          </DialogDescription>
                                          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-1">
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setOpenDeleteDialog(false)
                                              }
                                            >
                                              No
                                            </Button>
                                            <Button
                                              variant="default"
                                              onClick={() =>
                                                handleDelete(product)
                                              }
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
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">
                            No affiliate products available.
                          </p>
                        )}
                      </section>
                    </div>
                  </div>
                  <MockupPage products={products} userDb={userDb} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
