"use client";

import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
// Register FilePond Plugin
registerPlugin(FilePondPluginImagePreview);

type ProfileImageUploadProps = {
  userId: string;
  existingImage?: string | null;
};

export default function ProfileImageUpload({
  userId,
  existingImage,
}: ProfileImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(existingImage || null);
  const [isUploading, setIsUploading] = useState(false); // Prevents duplicate uploads
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  async function handleFileUpload(files: File[]) {
    if (files.length === 0 || isUploading) return;

    const file = files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file);
      if (existingImage) {
        formData.append("existingImage", existingImage);
      }

      const response = await fetch("/api/user/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully!",
      });
      // Close the dialog after successful upload
      setIsOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center space-x-4 mt-8">
      {/* Profile Image Display */}
      <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-800 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            width={150}
            height={150}
            quality={100}
          />
        ) : (
          <span className="text-gray-500 text-sm">No Image</span>
        )}
      </div>

      {/* Upload Image Button + Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isUploading}>
            {isUploading ? (
              <div className="flex flex-row items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.0}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span>Upload Profile Image</span>
              </div>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Image</DialogTitle>
          </DialogHeader>

          {/* FilePond Dropzone */}
          <FilePond
            allowMultiple={false}
            maxFiles={1}
            acceptedFileTypes={["image/*"]}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file as File);
              handleFileUpload(files);
            }}
            className="border border-gray-300 rounded-lg p-4"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
