import { IPhoneMockup } from "react-device-mockup";
import { useUserDb } from "@/context/UserDbContext";
import { social } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SelectProduct } from "@/db/schema";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import VideoPage from "../video/videopage";
export default function MockupPage({
  products,
}: {
  products: SelectProduct[];
}) {
  const { userDb, loading } = useUserDb();

  return (
    <IPhoneMockup
      screenWidth={300}
      screenType={"notch"}
      frameColor={"#000000"}
      hideStatusBar
      transparentNavBar
      className="hidden sm:block"
    >
      <VideoPage products={products} />
    </IPhoneMockup>
  );
}
