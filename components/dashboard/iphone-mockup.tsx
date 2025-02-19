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
      {loading || !userDb ? (
        <div className="flex flex-col items-center justify-center pt-12 pb-8 h-full w-full bg-neutral-100">
          <p className="flex flex-row items-center gap-2">
            <span className="animate-spin">
              <Loader2 className="size-4" />
            </span>
            Loading...
          </p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full bg-neutral-100">
          <div className="flex flex-col items-center pt-12 pb-8 h-full w-full">
            <div className="relative h-20 w-20 border-2 border-neutral-700 rounded-full">
              <Image
                src={userDb.profilePicture || "/path/to/placeholder.png"}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="text-sm font-semibold text-neutral-900 mt-4">
              {userDb.username}
            </div>
            <div className="text-xs text-neutral-500 mt-1">{userDb.bio}</div>
            <div className="text-sm text-neutral-500 mt-4 flex flex-row gap-2">
              {userDb.socialAccounts?.map((item) => (
                <Link
                  href={item.url}
                  key={item.name}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "icon",
                  })}
                >
                  {social.find((s) => s.name === item.name)?.icon &&
                    React.createElement(
                      social.find((s) => s.name === item.name)!.icon,
                      {
                        className: "size-4 text-gray-500",
                      }
                    )}
                </Link>
              ))}
            </div>

            <div className="mt-8 w-full px-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <Link
                    key={product.id}
                    className="border rounded-2xl shadow-sm mb-4 flex flex-col items-start w-full"
                    href={product.shortLink}
                    target="_blank" // Open link in new tab
                    rel="noopener noreferrer" // Security best practice
                  >
                    {product.imageUrl && (
                      <div className="w-full flex justify-center">
                        <Image
                          src={product.imageUrl}
                          alt={product.productName}
                          quality={40}
                          className="w-full sm:w-full rounded-t-md"
                          width={150}
                          height={150}
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-left w-full p-4">
                      <h3 className="text-sm font-semibold">
                        {product.productName}
                      </h3>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No affiliate products available.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      )}
    </IPhoneMockup>
  );
}
