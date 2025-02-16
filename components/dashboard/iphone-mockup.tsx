import { IPhoneMockup } from "react-device-mockup";
import { useUserDb } from "@/context/UserDbContext";
import { social } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function MockupPage() {
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
        <div className="flex flex-col items-center pt-12 pb-8 h-full w-full bg-neutral-100">
          <div className="w-16 h-16 bg-neutral-200 rounded-full"></div>
          <div className="text-sm font-semibold text-neutral-900 mt-4">
            {userDb.username}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {userDb.bio}
          </div>
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
        </div>
      )}
    </IPhoneMockup>
  );
}
