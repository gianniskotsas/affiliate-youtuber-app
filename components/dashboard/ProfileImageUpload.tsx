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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Image"}
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
