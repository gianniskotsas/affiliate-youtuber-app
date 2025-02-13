import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { getSupabaseClient } from "@/lib/supabase";

const formSchema = z.object({
  videoTitle: z.string().min(3, "Title must be at least 3 characters"),
  videoSlug: z.string().min(3, "Slug must be at least 3 characters"),
  videoDescription: z.string().optional(),
  videoThumbnail: z.string().url("Thumbnail must be a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseClient()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { videoTitle: "", videoSlug: "", videoDescription: "", videoThumbnail: "" },
  });

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, file);
        
      if (error) {
        console.error('Error uploading thumbnail:', error);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(fileName);
        
      form.setValue("videoThumbnail", publicUrl);
      setPreview(publicUrl);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("videoTitle", values.videoTitle);
    formData.append("videoSlug", values.videoSlug);
    if (values.videoDescription) {
      formData.append("videoDescription", values.videoDescription);
    }
    formData.append("videoThumbnail", values.videoThumbnail);

    const response = await fetch("/api/videos", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    
    onClose();
    router.push(`/video/${data.videoSlug}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField name="videoTitle" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="Title" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="videoSlug" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl><Input placeholder="Slug" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="videoDescription" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Description" {...field} /></FormControl>
              </FormItem>
            )} />

            <FormField name="videoThumbnail" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
                </FormControl>
                {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Video"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
