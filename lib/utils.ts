import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { supabase } from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const iconMap = {
  FaXTwitter: FaXTwitter,
  FaYoutube: FaYoutube,
  FaTiktok: FaTiktok,
  FaInstagram: FaInstagram,
};

// ✅ Delete Image from Supabase Storage
export const deleteImage = async (path: string) => {
  try {
   
    
    const { error } = await supabase.storage
      .from("thumbnails")
      .remove([path]);
    if (error) throw error;
    console.log(`Deleted image: ${path}`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
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
