import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";

const features = [
  {
    title: "Instant Access with QR Codes",
    description:
      "Generate unique QR codes linking directly to your personalized showcase page. Viewers instantly scan these from your videos or streams, seamlessly accessing your recommended products without typing links.",
    image:
      "https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/landing_page/smart_links.png",
  },
  {
    title: "Understand What Drives Clicks",
    description:
      "Gain valuable insights with detailed analytics on link performance. Understand which products resonate most, identify top performers, and refine your strategy to double down on what drives conversions.",
    image:
      "https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/landing_page/analytics_page.png",
  },
  {
    title: "Create a Stunning Product Page",
    description:
      "Effortlessly consolidate all your affiliate links onto one beautifully designed, personalized page. Create a stunning visual gallery of your recommended products, enhancing trust and driving more conversions.",
    image:
      "https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/landing_page/personal_page.png",
  },
];

export default function FeatureSection() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-wrap justify-center items-center  gap-8 md:gap-16">
      <div className="flex flex-col gap-4 sm:gap-8 items-center justify-center min-h-[300px] text-center sm:min-h-[500px]">
        <h1 className="text-4xl md:text-6xl lg:text-6xl font-400 max-w-5xl mx-auto leading-tight font-kavivanar">
          Everything you need to boost affiliate revenue.
        </h1>

        <p className="text-gray-700 max-w-2xl mx-auto text-lg sm:text-2xl">
          From showcasing products to tracking performance — it’s all built for
          creators who want results.
        </p>

        <Link
          href="sign-up"
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-full px-8 py-3 font-medium shadow-md hover:shadow-lg transition-shadow"
          )}
        >
          Start growing now
        </Link>
      </div>
      <div className="flex flex-wrap gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="w-full h-[400px] md:h-[550px] rounded-3xl p-8 flex flex-col justify-center border-2 overflow-hidden"
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col gap-4 h-full justify-center text-left w-full md:w-3/5">
                <p className="text-4xl font-medium">
                  {feature.title}
                </p>
                <p className="text-lg text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <div className="w-full h-full  overflow-hidden hidden md:flex justify-center items-center lg:pr-0 sm:-mb-0 lg:-mr-8 lg:-mb-64 ml-16">
                <div className="w-full xl:h-full lg:rounded-tr-none lg:rounded-r-none rounded-3xl border-t-2 border-l-[8px] lg:border-r-none border-r-2 lg:border-r-0 border-b-[8px] border-black overflow-hidden">
                  <Image
                    src={feature.image}
                    alt="QR code"
                    width={1920}
                    height={1080}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
