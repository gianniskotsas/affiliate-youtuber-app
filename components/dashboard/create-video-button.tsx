import { useState, useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  videoThumbnail: z.string().url("Thumbnail must be a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { videoTitle: "", videoSlug: "", videoThumbnail: "" },
  });

  const [isOpenStatus, setIsOpenStatus] = useState(isOpen);

  const handleSubmit = async (values: FormValues) => {
    setIsLoadingCreate(true);

    const requestData = {
      videoTitle: values.videoTitle,
      videoSlug: values.videoSlug,
      videoThumbnail: preview
    };

    console.log("Creating video...");
    console.log(requestData);

    const response = await fetch("/api/videos/create-videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });
    const data = await response.json();
    console.log(data);
    setIsLoadingCreate(false);
    onClose();
    // router.push(`/video/${data.videoSlug}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        form.handleSubmit(handleSubmit)();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [form, handleSubmit]);

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
      
      console.log(publicUrl);

      form.setValue("videoThumbnail", publicUrl);
      setPreview(publicUrl);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Video</Button>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            <Button type="submit" className="mt-8" disabled={isLoadingCreate}>
              {isLoadingCreate ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <span>Create video <span className="bg-gray-700/80 p-1 ml-2 rounded-md">⌘↵</span></span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
