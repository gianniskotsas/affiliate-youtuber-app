import { useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { supabase } from "@/lib/supabase";
import { SelectProduct } from "@/db/schema";

registerPlugin(FilePondPluginImagePreview);

interface FilePondUploaderProps {
  product: SelectProduct;
  setProduct: (updatedProduct: SelectProduct) => void;
}

const FilePondUploader: React.FC<FilePondUploaderProps> = ({
  product,
  setProduct,
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
        product.imageUrl
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
            const filePath = `products/${Date.now()}_${file.name}`;

            // Upload directly to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
              .from("thumbnails")
              .upload(filePath, file, { cacheControl: "3600", upsert: false });

            if (uploadError) throw uploadError;

            // ✅ Construct the correct public URL manually
            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/${filePath}`;

            // Update Parent State
            setProduct({ ...product, imageUrl: publicUrl });

            load(publicUrl); // ✅ Marks upload as successful
          } catch (err) {
            console.error("Upload Error:", err);
            error("Upload failed");
          }
        },

        revert: async (uniqueFileId, load, error) => {
          if (product.imageUrl) {
            const filePath = product.imageUrl.split("/thumbnails/")[1]; // Extract file path
            console.log("Deleting:", filePath);

            // Delete from Supabase Storage
            const { error: deleteError } = await supabase.storage
              .from("thumbnails")
              .remove([filePath]);

            if (deleteError) {
              console.error("Delete Error:", deleteError);
              error("Failed to delete file");
              return;
            }

            // Update Parent State
            setProduct({ ...product, imageUrl: null });

            load(); // Notify FilePond deletion was successful
          }
        },
      }}
      className="border border-gray-300 aspect-video rounded-lg p-4"
    />
  );
};

export default FilePondUploader;
