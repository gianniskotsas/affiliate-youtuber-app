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

const QrCodeModal = ({ url, videoId }: { url: string; videoId: string }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false); // ✅ Cache state

  const fetchQrCode = async () => {
    if (fetched || qrCodeUrl) return; // ✅ Prevent duplicate API calls

    setLoading(true);
    try {
      const response = await fetch(`/api/dub/get-qr-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, videoId }),
      });

      const data = await response.json();
      if (data.qrCodeUrl) {
        setQrCodeUrl(data.qrCodeUrl);
        console.log("data.qrCodeUrl");
        console.log(data.qrCodeUrl);
        setFetched(true); // ✅ Cache result
      } else {
        console.error("No QR code URL received.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cleanup: Revoke object URL if we ever use `createObjectURL()`
  useEffect(() => {
    return () => {
      if (qrCodeUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={fetchQrCode}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-2 sm:mt-0 px-4 py-2 rounded-md transition min-w-[150px]"
          )}
        >
          <div className="flex items-center gap-2">
            <QrCode size={16} />
            Get QR Code
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-md"
            unoptimized
          />
        ) : (
          <p>No QR code generated yet.</p>
        )}
        <DialogFooter>
          <Button
            onClick={() => {
              setQrCodeUrl(null);
              setFetched(false); // ✅ Allow re-fetch if needed
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
