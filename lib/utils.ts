import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons/lib";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const iconMap = {
  FaXTwitter: FaXTwitter,
  FaYoutube: FaYoutube,
  FaTiktok: FaTiktok,
  FaInstagram: FaInstagram,
};

// Defining the icon type according to social selection
export const social: { name: string; icon: IconType }[] = [
  {
    name: "X",
    icon: FaXTwitter,
  },
  {
    name: "YouTube",
    icon: FaYoutube,
  },
  {
    name: "TikTok",
    icon: FaTiktok,
  },
  {
    name: "Instagram",
    icon: FaInstagram,
  },
];
