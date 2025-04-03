"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex bg-[#A8D9DD] flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="relative w-32 h-32 md:w-64 md:h-64">
        <Image
          src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/not-published/oops_person.png"
          alt="404 Not Found"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center flex flex-col items-center gap-2 mt-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 max-w-md">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Button
            variant="default"
            onClick={() => router.back()}
            className="group bg-black hover:bg-black/90 text-white h-10 px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </div>
          </Button>
          <Link 
            href="/"
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              "bg-white text-black border border-black h-10 px-4 py-2 hover:bg-gray-100"
            )}
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 