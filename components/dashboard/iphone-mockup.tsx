import { IPhoneMockup } from "react-device-mockup";
import { useUserDb } from "@/context/UserDbContext";
import { SelectProduct } from "@/db/schema";
import VideoPage from "../video/videopage";
import React, { createContext } from "react";

// Create a context to simulate a mobile screen
export const MobileContext = createContext<boolean>(false);

export default function MockupPage({
  products,
}: {
  products: SelectProduct[];
}) {
  const { userDb } = useUserDb();

  if (!userDb) {
    return null;
  }

  return (
    <IPhoneMockup
      screenWidth={300}
      screenType={"notch"}
      frameColor={"#000000"}
      hideStatusBar
      transparentNavBar
      className="hidden sm:block"
    >
      {/* Provide a mobile context to trick VideoPage into thinking it's on mobile */}
      <MobileContext.Provider value={true}>
        <VideoPage products={products} userDb={userDb} />
      </MobileContext.Provider>
    </IPhoneMockup>
  );
}
