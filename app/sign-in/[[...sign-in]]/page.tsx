import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
export default function Page() {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block w-full md:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/veevo_logo_dark.jpg"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              "cardBox": "border-none shadow-none",
              "signIn-start": "border-none shadow-none",
              "footer": "border-none shadow-none bg-white",
            },
          }}
        />
      </div>
    </div>
  );
}
