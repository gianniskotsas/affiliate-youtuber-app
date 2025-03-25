import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { supabase } from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define Invoice Type
export type Invoice = {
  id: string;
  invoiceNumber: string | null;
  date: Date;
  paid: boolean;
  amount_paid: number;
  url: string;
};

// Function to map Stripe invoice to our Invoice type
export function mapStripeInvoice(stripeInvoice: any): Invoice {
  return {
    id: stripeInvoice.id,
    invoiceNumber: stripeInvoice.number ?? null, // Can be null
    date: new Date(stripeInvoice.created * 1000), // Convert Unix timestamp
    paid: stripeInvoice.paid,
    amount_paid: stripeInvoice.amount_paid / 100, // Convert cents to dollars
    url: stripeInvoice.invoice_pdf,
  };
}

export const iconMap = {
  FaXTwitter: FaXTwitter,
  FaYoutube: FaYoutube,
  FaTiktok: FaTiktok,
  FaInstagram: FaInstagram,
};

// ✅ Delete Image from Supabase Storage
export const deleteImage = async (fullPath: string) => {
  console.log("deleteImage");
  console.log("fullPath", fullPath);

  try {
    const bucketUrl =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_URL + "thumbnails/";

    if (!bucketUrl) {
      throw new Error("Bucket URL is not defined");
    }

    const path = fullPath.replace(bucketUrl, "");
    console.log(path);

    const { error } = await supabase.storage.from("thumbnails").remove([path]);
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

export const dubTagMap = [
  {
    id: "tag_1JQ6217QE4X5HPMYRX6X8QY4C",
    name: "productpage",
  },
  {
    id: "tag_1JQ620V89HC0FPR0N42JBYWNN",
    name: "videopage",
  },
];
