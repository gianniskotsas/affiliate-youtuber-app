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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { SelectProduct } from "@/db/schema";
import { Pencil } from "lucide-react";
import FilePondUploader from "./filepondUploader"; // Import the FilePondUploader component
import { deleteImage } from "@/lib/utils";

// ✅ Zod Schema for Validation
const productSchema = z.object({
  videoId: z.string(),
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  productDescription: z.string().optional(),
  originalLink: z.string().url("Invalid URL format"),
  imageUrl: z.string().url("Invalid URL format").optional(),
  shortLink: z.string().url("Invalid URL format").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const UpdateProductButton = ({
  videoId,
  onProductAdded,
  product,
  setProduct,
}: {
  videoId: string;
  onProductAdded: () => void;
  product: SelectProduct;
  setProduct: (product: SelectProduct) => void;
}) => {

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SelectProduct>(product);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      videoId: videoId,
      productName: selectedProduct.productName,
      productDescription: selectedProduct.productDescription || "",
      originalLink: selectedProduct.originalLink,
      imageUrl: selectedProduct.imageUrl || "",
      shortLink: selectedProduct.shortLink,
    },
  });

  const { control, setValue, getValues, handleSubmit, formState: { errors } } = form;

  // ✅ Handle Form Submission
  const onSubmit = async (data: ProductFormData) => {
    console.log(data);

    try {
      const response = await fetch("/api/products/update-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      toast({
        title: "Product Updated",
        description: `Successfully updated ${data.productName}!`,
      });

      setOpen(false);
      onProductAdded();
    } catch (error) {
      console.error("Error updating product:", error);

      toast({
        title: "Error",
        description: "Failed to update product. Try again.",
        variant: "destructive",
      });
    }
  };

  // Function to update the imageUrl form field and selectedProduct
  const updateFormImageUrl = (url: string) => {
    setValue("imageUrl", url);
    setSelectedProduct((prev) => ({ ...prev, imageUrl: url }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex flex-row items-center gap-2 w-full">
        <Pencil size={16} />
        Edit
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onPointerMove={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
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

              {/* ✅ Product Image Upload - Now Using FilePondUploader */}
              <div className="w-full sm:w-1/2">
                <FormLabel className="mb-1 font-semibold text-neutral-700">
                  Product Image
                </FormLabel>

                {selectedProduct.imageUrl ? (
                  <div className="relative group w-full mt-2">
                    {/* ✅ Image Preview */}
                    <Image
                      src={selectedProduct.imageUrl}
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
                        setProduct({ ...product, imageUrl: "" });
                        setSelectedProduct({ ...selectedProduct, imageUrl: "" });
                        updateFormImageUrl(""); // Update form value to empty

                        try {
                          if (selectedProduct.imageUrl) {
                            deleteImage(selectedProduct.imageUrl);
                            const response = await fetch(
                              "/api/products/update-product-image",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  productId: selectedProduct.id,
                                  imageUrl: "",
                                }),
                              }
                            );

                            if (!response.ok) {
                              toast({
                                title: "Error",
                                description: "Failed to update product image",
                                variant: "destructive",
                              });
                              throw new Error("Failed to update product image");
                            }

                            toast({
                              title: "Product Image Updated",
                              description: "New image added successfully",
                            });
                          }
                        } catch (error) {
                          console.error("Error deleting image:", error);
                        }
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  // ✅ Show FilePondUploader when image is removed
                  <FilePondUploader
                    product={product}
                    setProduct={setProduct}
                    updateFormImageUrl={updateFormImageUrl} // Pass the callback
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
              <Button type="submit">Update Product</Button>
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

export default UpdateProductButton;
