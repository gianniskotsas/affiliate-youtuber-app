"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { deleteImage } from "@/lib/utils";
import FilePondUploader from "./filepondUploader";
registerPlugin(FilePondPluginImagePreview);

// ✅ Zod Schema for Validation
const productSchema = z.object({
  videoId: z.string(),
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  productDescription: z.string().optional(),
  originalLink: z.string().url("Invalid URL format"),
  imageUrl: z.string().url("Invalid URL format").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const CreateProductButton = ({
  videoId,
  onProductAdded,
}: {
  videoId: string;
  onProductAdded: () => void;
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(""); // Store image path for deletion

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      videoId: videoId,
      productName: "",
      productDescription: "",
      originalLink: "",
      imageUrl: "",
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  // Function to update the imageUrl in the form and parent state
  const updateImageUrl = (url: string) => {
    setValue("imageUrl", url);
    setImagePath(url);
  };

  // ✅ Handle Form Submission
  const onSubmit = async (data: ProductFormData) => {
    console.log(data);

    try {
      const response = await fetch("/api/products/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      toast({
        title: "Product Created",
        description: `Successfully added ${data.productName}!`,
      });

      setOpen(false);
      onProductAdded();
    } catch (error) {
      console.error("Error creating product:", error);

      // If submission fails, delete uploaded image
      if (imagePath) {
        await deleteImage(imagePath);
      }

      toast({
        title: "Error",
        description: "Failed to create product. Try again.",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle Image Upload to Supabase
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const fileName = `products/${Date.now()}_${files[0].name}`;
      const { data, error } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, files[0], { cacheControl: "3600", upsert: false });

      if (error) throw error;

      // ✅ Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(fileName);

      console.log(publicUrlData.publicUrl);
      setValue("imageUrl", publicUrlData.publicUrl);
      setImagePath(fileName); // Store file path for potential deletion
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Could not upload image. Try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full rounded-lg max-w-screen-sm">
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Product</DialogTitle>
          <p className="text-sm text-gray-500">
            Link this product to your video.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-row gap-4 pb-8 pt-2">
              <div className="flex flex-col gap-4 w-full sm:w-1/2">
                {/* ✅ Product Name */}
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 font-semibold text-neutral-700">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ✅ Product Description */}
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 font-semibold text-neutral-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description (optional)"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* ✅ Original Affiliate Link */}
                <FormField
                  control={form.control}
                  name="originalLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 font-semibold text-neutral-700">
                        Original Link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ Product Image Upload */}
              <div className="w-full sm:w-1/2">
                <FormLabel className="mb-1 font-semibold text-neutral-700">
                  Product Image
                </FormLabel>

                {imagePath ? (
                  <div className="relative group w-full mt-2">
                    {/* ✅ Image Preview */}
                    <Image
                      src={imagePath}
                      alt="Product"
                      className="w-full h-auto rounded-md shadow-sm"
                      width={600}
                      height={337}
                    />

                    {/* ✅ Delete Button (X) */}
                    <Button
                      variant="secondary"
                      className="absolute top-2 left-2 p-0.5 w-5 h-5 aspect-square rounded-full shadow-md"
                      onClick={async () => {
                        setImagePath("");
                        setValue("imageUrl", ""); // Update form value to empty
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  // ✅ Show FilePondUploader when image is removed
                  <FilePondUploader
                    updateFormImageUrl={updateImageUrl}
                  />
                )}

                {/* ✅ Hidden Input Field for Image URL */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Create Product"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductButton;
