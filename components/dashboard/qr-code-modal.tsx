import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const QrCodeModal = ({ url, text }: { url: string, text: string }) => {
  const baseUrl = `https://api.dub.co/qr?url=${url}`;
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(baseUrl);

  // ✅ Cleanup: Revoke object URL if we ever use `createObjectURL()`
  useEffect(() => {
    return () => {
      if (qrCodeUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);

  if (!qrCodeUrl) {
    return null;
  }

  // Function to download the image
  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qrcode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // Function to copy the image to clipboard
  const handleCopy = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const clipboardItem = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([clipboardItem]);
    } catch (error) {
      console.error("Error copying image:", error);
    }
  };

  return (
    
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        <p className="text-sm text-gray-500">{text}</p>
      </DialogHeader>

        <div className="w-full justify-center items-center flex bg-neutral-100 p-6 rounded-xl">
          <Image
            src={`https://api.dub.co/qr?url=${url}&logo=https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/veevo_logo_dark.jpg`}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-md"
            unoptimized
          />
        </div>
        <div className="flex flex-row gap-2 items-center w-full">
          <Button
            variant="outline"
            className="min-w-[150px] w-full sm:w-auto flex flex-row gap-2 items-center"
            onClick={handleDownload}
          >
            Download
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="min-w-[150px] flex flex-row gap-2 items-center w-full sm:w-auto "
            onClick={handleCopy}
          >
            Copy
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
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </Button>
        </div>
      </DialogContent>
  );
};

export default QrCodeModal;
