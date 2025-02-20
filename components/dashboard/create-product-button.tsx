"use client";

import { useState } from "react";
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
  const [imagePath, setImagePath] = useState<string | null>(null); // Store image path for deletion

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

  // ✅ Delete Image from Supabase Storage
  const deleteImage = async (path: string) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Product</Button>
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
                      <FormLabel className="mb-1">Product Name</FormLabel>
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
                      <FormLabel className="mb-1">Description</FormLabel>
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
                      <FormLabel className="mb-1">Original Link</FormLabel>
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
                <FormLabel className="mb-1">Product Image</FormLabel>
                <FilePond
                  allowMultiple={false}
                  maxFiles={1}
                  credits={false}
                  acceptedFileTypes={["image/*"]}
                  onupdatefiles={(fileItems) => {
                    const files = fileItems.map(
                      (fileItem) => fileItem.file as File
                    );
                    handleFileUpload(files);
                  }}
                  onremovefile={() => {
                    if (imagePath) {
                      deleteImage(imagePath);
                      setImagePath(null);
                    }
                  }}
                  className="border border-gray-300 aspect-video rounded-lg p-4"
                />

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
