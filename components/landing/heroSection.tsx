'use client'

import Image from "next/image";
import Link from "next/link";
import IPhoneMockup from "react-device-mockup/dist/ios-mockup/IPhoneMockup";
import { MobileContext } from "../dashboard/iphone-mockup";
import VideoPage from "../video/videopage";

// Mock data for demo purposes based on the actual schema
const userDb = {
  id: "user_123",
  email: "demo@example.com",
  username: "Veevo",
  bio: "Let's grow your affiliate marketing together!",
  profilePicture: "/person_placeholder_md.jpeg",
  socialAccounts: [
    { name: "X", url: "https://veevo.link/sign-up" },
    { name: "YouTube", url: "https://veevo.link/sign-up" },
    { name: "Instagram", url: "https://veevo.link/sign-up" },
    { name: "TikTok", url: "https://veevo.link/sign-up" },
  ],
  createdAt: new Date(),
  domain: "veevo.link",
  domainVerified: true,
  stripeCustomerId: "cus_123456",
  stripeSubscriptionId: "sub_123456",
  stripeSubscriptionStatus: true,
};

// Mock products based on the products schema
const demoProducts = [
  {
    id: "headphones",
    videoId: "vid_123",
    productName: "Wireless Headphones",
    shortLink: "https://veevo.link/sign-up",
    originalLink: "https://www.amazon.com/example-headphones/dp/B0123456789",
    imageUrl: "/landing/headphones_landingPage_md.jpeg",
    productDescription: "Premium noise-cancelling wireless headphones",
    createdAt: new Date(),
  },
  {
    id: "robotVacuum",
    videoId: "vid_123",
    productName: "Robot Vacuum",
    shortLink: "https://veevo.link/sign-up",
    originalLink: "https://www.amazon.com/example-robotvacuum/dp/B0987654321",
    imageUrl: "/landing/robotVacuum_landingPage_md.jpeg",
    productDescription: "Effortless cleaning, no mess.",
    createdAt: new Date(),
  },
  {
    id: "wallet",
    videoId: "vid_123",
    productName: "Magsafe Wallet",
    shortLink: "https://veevo.link/sign-up",
    originalLink: "https://www.amazon.com/example-wallet/dp/B01234567890",
    imageUrl: "/landing/wallet_landingPage_md.jpeg",
    productDescription: "A premium leather wallet for your iPhone.",
    createdAt: new Date(),
  },
  {
    id: "skinCare",
    videoId: "vid_123",
    productName: "Skin Care",
    shortLink: "https://veevo.link/sign-up",
    originalLink: "https://www.amazon.com/example-skinCare/dp/B01234567890",
    imageUrl: "/landing/skinCare_landingPage_md.jpeg",
    productDescription: "For smooth and radiant skin.",
    createdAt: new Date(),
  },
];



export default function HeroSection() {
  return (
    <div className="flex justify-center z-10 overflow-hidden">
      <div className="relative mt-12 min-w-[777px] md:mt-[114px] md:min-w-[1792px]">
       
        {/* Product Left #2 - Wireless headphones */}
        <div
          className="absolute left-[-3%] top-[96px] z-[10] hidden aspect-[250/296] w-full max-w-[250px] rounded-3xl md:left-[0px] md:block"
          style={{ transform: "translateY(0px)", opacity: 1 }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ perspective: "800px" }}
          >
            <div
              className="realtive h-full w-full"
              style={{
                transform: "rotateX(15deg) rotateY(15deg) rotateZ(-2deg)",
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-black/5">
                  <Link
                    key="1"
                    className="group border rounded-2xl shadow-sm mb-4 flex flex-col text-left items-start w-full h-full p-2.5 bg-neutral-50"
                      href="https://veevo.link/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-full flex justify-center">
                      <div
                        className="group-hover:shadow-md transition-all duration-300 relative w-full border rounded-xl"
                        style={{ paddingTop: "90.25%" }}
                      >
                        <Image
                          src="/landing/headphones_landingPage_md.jpeg"
                          alt="Wireless Headphones"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full p-2.5">
                      <div className="flex flex-col items-left w-full">
                        <h3 className="text-sm font-semibold">
                          Wireless headphones
                        </h3>
                        <p className="text-xs text-gray-500 w-full">
                          Slick design, active noise cancellation.
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Left #1 - Robot vacuum */}
        <div
          className="absolute left-[6%] top-[96px] z-[10] aspect-[340/380] w-full max-w-[204px] rounded-2xl xs:left-[4%] md:left-[280px] md:top-[26px] md:max-w-[340px] md:rounded-3xl"
          style={{ transform: "translateY(0px)", opacity: 1 }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ perspective: "800px" }}
          >
            <div
              className="realtive h-full w-full"
              style={{
                transform: "rotateX(8deg) rotateY(-15deg) rotateZ(-2deg)",
              }}
            >
              <div
                className="absolute inset-0 will-change-transform"
                style={{ transform: "translateY(12.1041px)" }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-black/5">
                    <Link
                      key="1"
                      className="group border rounded-2xl shadow-sm mb-4 flex flex-col text-left items-start w-full h-full p-2.5 bg-neutral-50"
                      href="https://veevo.link/sign-up"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-full flex justify-center">
                        <div
                          className="group-hover:shadow-md transition-all duration-300 relative w-full border rounded-xl"
                          style={{ paddingTop: "90%" }}
                        >
                          <Image
                            src="/landing/robotVacuum_landingPage_md.jpeg"
                            alt="Robot Vacuum"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full p-2.5">
                        <div className="flex flex-col items-left w-full">
                          <h3 className="text-sm font-semibold">
                            Robot vacuum
                          </h3>
                          <p className="text-xs text-gray-500 w-full">
                            Effortless cleaning, no mess.
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Right #1 - Wallet Mockup */}
        <div
          className="absolute right-[4%] top-[96px] z-[10] aspect-[340/384] w-full max-w-[204px] rounded-2xl xs:right-[4%] md:right-[300px] md:top-[0px] md:aspect-[313/380] md:max-w-[313px] md:rounded-3xl"
          style={{ transform: "translateY(0px)", opacity: 1 }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ perspective: "800px" }}
          >
            <div
              className="realtive h-full w-full"
              style={{
                transform: "rotateX(10deg) rotateY(15deg) rotateZ(3deg)",
              }}
            >
              <div
                className="absolute inset-0 will-change-transform"
                style={{ transform: "translateY(20.1735px)" }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-black/5">
                    <Link
                      key="1"
                      className="group border rounded-2xl shadow-sm mb-4 flex flex-col text-left items-start w-full h-full p-2.5 bg-neutral-50"
                      href="https://veevo.link/sign-up"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-full flex justify-center">
                        <div
                          className="group-hover:shadow-md transition-all duration-300 relative w-full border rounded-xl"
                          style={{ paddingTop: "100%" }}
                        >
                          <Image
                            src="/landing/wallet_landingPage_md.jpeg"
                            alt="Magsafe Wallet"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full p-2.5">
                        <div className="flex flex-col items-left w-full">
                          <h3 className="text-sm font-semibold">
                            Magsafe Wallet
                          </h3>
                          <p className="text-xs text-gray-500 w-full">
                            A premium leather wallet for your iPhone.
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-20 border shadow-lg absolute right-[-30px] top-[30px] flex items-center gap-[6px] rounded-full bg-white py-[8px] pl-[10px] pr-4 font-medium">
              <div className="h-[25px] w-[25px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-click"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12l3 0" />
                  <path d="M12 3l0 3" />
                  <path d="M7.8 7.8l-2.2 -2.2" />
                  <path d="M16.2 7.8l2.2 -2.2" />
                  <path d="M7.8 16.2l-2.2 2.2" />
                  <path d="M12 12l9 3l-4 2l-2 4l-3 -9" />
                </svg>
              </div>
              <div>veevo.link/kotsas</div>
            </div>
          </div>
        </div>

        {/* Product Right #2 - Skin care */}
        <div
          className="absolute right-[-3%] top-[96px] z-[10] hidden aspect-[250/296] w-full max-w-[250px] rounded-3xl md:right-[5px] md:block"
          style={{ transform: "translateY(0px)", opacity: 1 }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ perspective: "800px" }}
          >
            <div
              className="realtive h-full w-full"
              style={{
                transform: "rotateX(-4deg) rotateY(5deg) rotateZ(-5deg)",
              }}
            >
              <div
                className="absolute inset-0 will-change-transform"
                style={{ transform: "translateY(10.0868px)" }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-black/5">
                    <Link
                      key="1"
                      className="group border rounded-2xl shadow-sm mb-4 flex flex-col text-left items-start w-full h-full p-2.5 bg-neutral-50"
                      href="https://veevo.link/sign-up"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-full flex justify-center">
                        <div
                          className="group-hover:shadow-md transition-all duration-300 relative w-full border rounded-xl"
                          style={{ paddingTop: "86.25%" }}
                        >
                          <Image
                            src="/landing/skinCare_landingPage_md.jpeg"
                            alt="Skin Care"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full p-2.5">
                        <div className="flex flex-col items-left w-full">
                          <h3 className="text-sm font-semibold">
                            Skin Care
                          </h3>
                          <p className="text-xs text-gray-500 w-full">
                            For smooth and radiant skin.
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iPhone Mockup */}
        <div className="relative mx-auto w-full max-w-[820px] ">
          <div
            className="pointer-events-none absolute left-[33px] top-[-10%] z-0 w-[800px] xs-medium:left-[-20%] xs-medium:w-[150%] md:left-[-40%] md:top-[-28%] md:w-[1329px]"
            style={{ opacity: 1 }}
          ></div>
          <div
            className="relative z-[20] mx-auto -mb-28 aspect-[423/870] w-full max-w-[247px] md:-mb-[34%] md:max-w-[423px]"
            style={{ opacity: 1, transform: "translateY(0px)" }}
          >
            <div
              className="absolute inset-0"
              style={{ transform: "translateY(-2.01735%)" }}
            >
              <div className="relative h-full w-full">
                <div className="relative h-full w-full " style={{ opacity: 1 }}>
                  <div className="h-full w-full">
                    <IPhoneMockup
                      screenWidth={380}
                      screenType={"notch"}
                      frameColor={"#000000"}
                      hideStatusBar
                      transparentNavBar
                      className="md:block hidden text-left"
                    >
                      <MobileContext.Provider value={true}>
                        <VideoPage products={demoProducts} userDb={userDb} />
                      </MobileContext.Provider>
                    </IPhoneMockup>
                    <IPhoneMockup
                      screenWidth={224}
                      screenType={"notch"}
                      frameColor={"#000000"}
                      hideStatusBar
                      transparentNavBar
                      className="md:hidden text-left"
                    >
                      <MobileContext.Provider value={true}>
                        <VideoPage products={demoProducts} userDb={userDb} />
                      </MobileContext.Provider>
                    </IPhoneMockup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
