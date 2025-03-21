import Link from "next/link";
import Image from "next/image";

import {
  Search,
  Users,
  Settings,
  Bell,
  ChevronDown,
  Mic,
  Video,
  ExternalLink,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-sky-200">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/veevo_logo_circle.png"
              alt="logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold">Veevo</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-gray-800 hover:text-black">
              Home
            </Link>
            <Link href="#" className="text-gray-800 hover:text-black">
              About
            </Link>
            <Link href="#" className="text-gray-800 hover:text-black">
              Support
            </Link>
            <Link href="#" className="text-gray-800 hover:text-black">
              Download
            </Link>
          </div>

          <Link
            href="#"
            className="bg-white rounded-full px-6 py-2 font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-full px-6 py-2 inline-block mb-8 font-medium">
          Boost your affiliate business
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold max-w-5xl mx-auto leading-tight">
          Create a landing page to showcase and track your affiliate products
        </h1>

        <p className="text-gray-700 mt-8 max-w-2xl mx-auto text-lg">
          Increase your affiliate sales by showing all your products in one
          place and understanding which ones are the top performers
        </p>

        <Button variant="default" className="mt-10 rounded-full px-8 py-3 font-medium shadow-md hover:shadow-lg transition-shadow">
          Get Started
        </Button>

        {/* Dashboard Preview */}
        <div className="w-full mt-12 h-1/4 sm:h-1/2 p-3 bg-neutral-500/20 rounded-2xl">
          <Image
            src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/Screenshot%202025-02-26%20at%2019.38.00.png"
            alt="Affilify"
            width={1920}
            height={1080}
            className="rounded-2xl"
          />
        </div>
      </main>

      {/* Logos */}
      <div className="container mx-auto px-4 py-16 flex flex-wrap justify-center items-center gap-8 md:gap-16">
        <div className="text-gray-500 font-bold text-xl">amazon</div>
        <div className="text-gray-500 font-bold text-xl">ATLASSIAN</div>
        <div className="text-gray-500 font-bold text-xl">GitHub</div>
        <div className="text-gray-500 font-bold text-xl">LaunchDarkly</div>
        <div className="text-gray-500 font-bold text-xl">NETFLIX</div>
        <div className="text-gray-500 font-bold text-xl">Medium</div>
      </div>
    </div>
  );
}
