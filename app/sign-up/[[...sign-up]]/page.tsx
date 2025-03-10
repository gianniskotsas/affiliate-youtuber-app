import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'
export default function Page() {
  return (
  <div className="flex h-screen">
    <div className="w-1/2 relative">
      <div className="absolute inset-0">
        <Image
          src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/veevo_logo_dark.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
    <div className="w-1/2 flex items-center justify-center">
      <SignUp />
    </div>
  </div>
  )
}
