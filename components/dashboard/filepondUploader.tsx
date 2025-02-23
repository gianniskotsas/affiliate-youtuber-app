import { useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { supabase } from "@/lib/supabase";
import { SelectProduct } from "@/db/schema";


interface FilePondUploaderProps {
  product?: SelectProduct;
  setProduct?: (updatedProduct: SelectProduct) => void;
  updateFormImageUrl: (url: string) => void;
}

const FilePondUploader: React.FC<FilePondUploaderProps> = ({
  product,
  setProduct,
  updateFormImageUrl,
}) => {
  const filePondRef = useRef<any>(null);

  return (
    <FilePond
      ref={filePondRef}
      allowMultiple={false}
      maxFiles={1}
      credits={false}
      acceptedFileTypes={["image/*"]}
      files={
        product?.imageUrl
          ? [
              {
                source: product.imageUrl,
                options: {
                  type: "limbo", // ✅ Marks file as preloaded and prevents re-upload
                },
              },
            ]
          : []
      }
      server={{
        process: async (
          fieldName,
          file,
          metadata,
          load,
          error,
          progress,
          abort
        ) => {

          try {
            const fileExtension = file.name.split('.').pop();
            const filePath = `products/${Date.now()}_${product?.id ? product.id : "new"}.${fileExtension}`;

            // ✅ Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
              .from("thumbnails")
              .upload(filePath, file, { cacheControl: "3600", upsert: false });

            if (uploadError) throw uploadError;

            // ✅ Construct the correct public URL manually
            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/${filePath}`;

            // ✅ Update the product's image URL in the database via Drizzle API route
            if (product) {
              const updateResponse = await fetch("/api/products/update-product-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  productId: product.id,
                  imageUrl: publicUrl,
                }),
              });

              if (!updateResponse.ok) {
                throw new Error("Failed to update product image in database.");
              }

              if (setProduct) {
                setProduct({ ...product, imageUrl: publicUrl });
              }

            }
          
            // ✅ Update Parent State
            updateFormImageUrl(publicUrl);

            load(publicUrl); // ✅ Marks upload as successful
          } catch (err) {
            console.error("Upload Error:", err);
            error("Upload failed");
          }
        },

        revert: async (uniqueFileId, load, error) => {
          if (!product || !product.imageUrl) {
            error("No product or image URL available");
            return;
          }
          const filePath = product.imageUrl.split("/thumbnails/")[1]; // Extract file path
          console.log("Deleting:", filePath);

          // ✅ Delete from Supabase Storage
          const { error: deleteError } = await supabase.storage
            .from("thumbnails")
            .remove([filePath]);

          if (deleteError) {
            console.error("Delete Error:", deleteError);
            error("Failed to delete file");
            return;
          }

          // ✅ Update the database to remove the image URL
          const updateResponse = await fetch("/api/products/update-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: product.id,
              imageUrl: null, // Remove the image URL in DB
            }),
          });

          if (!updateResponse.ok) {
            console.error("Failed to remove image URL from database.");
            error("Failed to update database.");
            return;
          }

          // ✅ Update Parent State
          if (setProduct) {
            setProduct({ ...product, imageUrl: null });
          }
          updateFormImageUrl("");

          load(); // ✅ Notify FilePond deletion was successful
        },
      }}
      className="border border-gray-300 aspect-video rounded-lg p-4 mt-2"
    />
  );
};

export default FilePondUploader;
