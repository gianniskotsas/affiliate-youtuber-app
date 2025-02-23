'use client'

import { social } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import React, { useContext } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SelectProduct, SelectUser } from "@/db/schema";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { MobileContext } from "../dashboard/iphone-mockup";
import clsx from "clsx";

export default function VideoPage({
  products,
  userDb,
}: {
  products: SelectProduct[];
  userDb: SelectUser;
}) {
  const isMobile = useContext(MobileContext);

  return (
    <section className="h-full w-full bg-neutral-100 flex flex-col overflow-hidden">
      {!userDb ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <p className="flex flex-row items-center gap-2">
            <span className="animate-spin">
              <Loader2 className="size-4" />
            </span>
            Loading...
          </p>
        </div>
      ) : (
        // ✅ Ensure `ScrollArea` is inside a flex container and has overflow-auto
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full overflow-auto">
            <div
              className={clsx(
                "flex flex-col items-center justify-start pt-12 pb-8 h-full w-full",
                !isMobile && "lg:flex-row lg:items-start lg:justify-start"
              )}
            >
              {/* User Profile Section */}
              <div
                className={clsx(
                  "flex flex-col items-center px-4 w-full",
                  !isMobile && "lg:items-start lg:w-1/3"
                )}
              >
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
                <div className="text-xs text-neutral-500 mt-1">
                  {userDb.bio}
                </div>
                <div className="text-sm text-neutral-500 mt-4 flex flex-row gap-2">
                  {userDb.socialAccounts?.map(
                    (item) =>
                      item.url && (
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
                      )
                  )}
                </div>
              </div>

              {/* Products Section */}
              <div
                className={clsx(
                  "mt-8 w-full px-4",
                  !isMobile && "lg:mt-0 lg:w-2/3"
                )}
              >
                {products.length > 0 ? (
                  <div
                    className={clsx(
                      "grid grid-cols-1 gap-4",
                      !isMobile && "lg:grid-cols-2"
                    )}
                  >
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        className="border rounded-2xl shadow-sm mb-4 flex flex-col items-start w-full"
                        href={product.shortLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {product.imageUrl && (
                          <div className="w-full flex justify-center">
                            <Image
                              src={product.imageUrl}
                              alt={product.productName}
                              quality={40}
                              className="w-full rounded-t-md"
                              width={150}
                              height={150}
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-left w-full p-4">
                          <h3 className="text-sm font-semibold">
                            {product.productName}
                          </h3>
                          <p className="text-xs text-gray-500 w-full">
                            {product.productDescription}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No affiliate products available.
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </section>
  );
}
