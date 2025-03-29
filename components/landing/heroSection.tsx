import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="flex justify-center">
      <div className="relative mt-60 min-w-[777px] md:mt-[114px] md:min-w-[1792px]">
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
              <div
                className="absolute inset-0 will-change-transform"
                style={{ transform: "translateY(10.0868px)" }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                  <div className="absolute inset-0 bg-black/5">
                    <Image
                      alt="AdobeStock 49826233"
                      fetchPriority="high"
                      width={1366}
                      height={911}
                      className="opacity-100 transition-opacity duration-200 h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2559&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      style={{ color: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                  <div className="absolute inset-0 bg-black/5">
                    <Image
                      alt="Paris Family Photos 17"
                      fetchPriority="high"
                      width={1600}
                      height={1067}
                      className="opacity-100 transition-opacity duration-200 h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1525904097878-94fb15835963?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      style={{ color: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                  <div className="absolute inset-0 bg-black/5">
                    <Image
                      alt="Frame 1948759733"
                      fetchPriority="high"
                      width={1140}
                      height={1152}
                      className="opacity-100 transition-opacity duration-200 h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      style={{ color: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-20 absolute right-[-30px] top-[30px] flex items-center gap-[6px] rounded-full bg-white py-[8px] pl-[10px] pr-4 font-medium">
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
                <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                  <div className="absolute inset-0 bg-black/5">
                    <Link
                      key="1"
                      className="group border rounded-2xl shadow-sm mb-4 flex flex-col text-left items-start w-full h-full p-2.5 bg-neutral-50"
                      href="https://www.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-full flex justify-center">
                        <div
                          className="group-hover:shadow-md transition-all duration-300 relative w-full border rounded-xl"
                          style={{ paddingTop: "56.25%" }}
                        >
                          <Image
                            src="https://images.unsplash.com/photo-1567721913486-6585f069b332?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Profile Picture"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full p-2.5">
                        <div className="flex flex-col items-left w-full">
                          <h3 className="text-sm font-semibold">
                            Handcrafted Leather Wallet
                          </h3>
                          <p className="text-xs text-gray-500 w-full">
                            A premium leather wallet with a sleek design and
                            multiple card slots.
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
        <div className="relative mx-auto w-full max-w-[820px]">
          <div
            className="pointer-events-none absolute left-[33px] top-[-10%] z-0 w-[800px] xs-medium:left-[-20%] xs-medium:w-[150%] md:left-[-40%] md:top-[-28%] md:w-[1329px]"
            style={{ opacity: 1 }}
          >
            <svg
              width="100%"
              viewBox="0 0 1329 1282"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "auto" }}
            >
              <g mask="url(#homeMask)">
                <path
                  d="M326.625 743.707C308.185 766.952 281.771 792.988 252.302 796.577C244.865 797.485 237.133 796.572 229.106 793.837C221.188 791.148 214.635 786.792 209.444 780.769C199.009 768.641 194.305 754.61 195.331 738.673C197.425 706.281 214.686 674.376 231.542 646.312C245.027 623.86 258.107 602.196 270.782 581.319C286.338 555.704 298.487 531.262 307.229 507.995C313.437 491.479 317.468 476.268 319.323 462.364C322.306 439.992 319.677 416.261 311.515 395.589L208.528 409.941C230.819 429.924 225.316 453.685 215.134 478.067C197.771 519.633 172.915 557.063 148.855 596.09C134.038 620.108 121.6 645.25 111.542 671.516C102.064 696.316 97.7254 722.546 98.5262 750.207C98.8286 760.632 100.627 771.781 103.093 781.58C111.521 815.124 128.877 842.112 155.162 862.544C187.481 887.664 224.551 897.89 266.372 893.221C301.931 889.255 336.142 871.471 362.575 846.922C414.932 798.27 456.582 731.723 488.747 666.598C511.954 619.605 535.025 569.422 557.959 516.049C558.344 515.165 558.094 514.515 557.212 514.098L469.658 473.371C468.794 472.981 468.184 473.219 467.827 474.084C442.444 534.087 417.227 589.681 386.474 648.791C366.885 686.444 346.935 718.082 326.625 743.707Z"
                  fill="#6475E9"
                ></path>
                <path
                  d="M326.625 743.707C308.185 766.952 281.771 792.988 252.302 796.577C244.865 797.485 237.133 796.572 229.106 793.837L266.372 893.221C301.931 889.255 336.142 871.471 362.575 846.922C414.932 798.271 456.582 731.723 488.747 666.598C511.954 619.605 535.025 569.422 557.96 516.05C558.344 515.166 558.094 514.515 557.212 514.098L469.658 473.371C468.794 472.981 468.184 473.219 467.827 474.085C442.444 534.087 417.227 589.681 386.474 648.791C366.885 686.444 346.935 718.083 326.625 743.707Z"
                  fill="#6475E9"
                ></path>
                <path
                  d="M731.226 288.755C701.758 292.344 675.344 318.38 656.904 341.625C636.594 367.25 616.644 398.888 597.055 436.541C566.302 495.651 541.085 551.246 515.702 611.248C515.345 612.113 514.735 612.351 513.871 611.962L426.317 571.234C425.434 570.817 425.185 570.167 425.569 569.283C448.504 515.91 471.575 465.727 494.782 418.734C526.947 353.609 568.597 287.062 620.953 238.41C647.387 213.861 681.598 196.077 717.157 192.112C758.978 187.442 796.047 197.668 828.367 222.788C854.651 243.22 872.008 270.208 880.436 303.752C882.901 313.551 884.7 324.7 885.003 335.125C885.803 362.786 881.465 389.016 871.987 413.816C861.929 440.082 849.491 465.224 834.674 489.242C810.614 528.269 785.758 565.699 768.395 607.265C758.213 631.647 752.71 655.408 775.001 675.391C788.061 687.095 807.686 694.546 825.013 688.909C830.107 687.261 835.185 684.222 840.249 679.793C859.993 662.53 873.731 641.825 885.959 618.99C896.708 598.933 907.58 578.54 918.576 557.811C947.811 502.621 982.014 444.557 1040.36 416.688C1114 381.47 1200.36 409.585 1238.36 481.653C1275.66 552.437 1247.52 637.001 1214.54 703.34C1173.62 785.644 1120.54 861.917 1066.53 936.141C1066.37 936.37 1066.17 936.406 1065.96 936.249L984.751 880.789C984.649 880.722 984.563 880.634 984.496 880.532C984.429 880.43 984.384 880.315 984.363 880.194C984.342 880.072 984.345 879.947 984.373 879.826C984.4 879.705 984.451 879.591 984.524 879.489C1033.67 811.482 1083.44 742.428 1121.44 670.396C1137.23 640.456 1148.63 611.026 1155.64 582.107C1159.91 564.469 1159.7 548.694 1155.01 534.782C1142.56 497.906 1104.26 488.562 1072.99 509.188C1065.48 514.126 1058.41 520.587 1051.79 528.571C1036.09 547.424 1022.13 568.391 1009.9 591.471C992.154 624.984 975.214 658.293 955.324 690.661C929.399 732.877 889.249 776.082 837.743 784.688C803.911 790.341 772.11 785.046 742.339 768.804C709.109 750.68 685.668 724.327 672.013 689.743C663.852 669.071 661.223 645.34 664.206 622.968C666.061 609.064 670.092 593.853 676.3 577.337C685.042 554.07 697.191 529.628 712.747 504.013C725.422 483.136 738.501 461.472 751.986 439.02C768.843 410.956 786.103 379.051 788.197 346.659C789.224 330.722 784.52 316.691 774.084 304.563C768.894 298.54 762.34 294.184 754.423 291.495C746.396 288.76 738.663 287.847 731.226 288.755Z"
                  fill="#6475E9"
                ></path>
              </g>
              <mask id="homeMask">
                <path
                  d="M251.443 379.995C343.8 522.546 72.7626 653.05 150.047 793.593C227.332 934.136 373.91 810.659 426.127 683.167C478.345 555.674 614.246 239.654 720.255 240.457C852.767 241.46 853.771 366.945 801.569 448.259C749.367 529.573 655.003 599.844 749.367 719.306C843.732 838.767 964.197 558.686 1019.41 487.41C1074.62 416.135 1249.87 459.35 1211.15 584.786C1172.43 710.223 1075.97 890.3 972.237 931.124"
                  stroke="white"
                  strokeWidth="120"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  strokeDashoffset="0px"
                  strokeDasharray="1px 1px"
                ></path>
              </mask>
            </svg>
          </div>
          <div className="pointer-events-none absolute left-[33px] top-[-10%] z-[15] w-[800px] transform-gpu xs-medium:left-[-20%] xs-medium:w-[150%] md:left-[-40%] md:top-[-28%] md:w-[1329px]">
            <svg
              className="transform-gpu"
              width="100%"
              viewBox="0 0 1329 1282"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "auto" }}
            >
              <g mask="url(#homeMask)">
                <path
                  d="M326.625 743.707C308.185 766.952 281.771 792.988 252.302 796.577C244.865 797.485 237.133 796.572 229.106 793.837L266.372 893.221C301.931 889.255 336.142 871.471 362.575 846.922C414.932 798.271 456.582 731.723 488.747 666.598C511.954 619.605 535.025 569.422 557.96 516.05C558.344 515.166 558.094 514.515 557.212 514.098L469.658 473.371C468.794 472.981 468.184 473.219 467.827 474.085C442.444 534.087 417.227 589.681 386.474 648.791C366.885 686.444 346.935 718.083 326.625 743.707Z"
                  fill="#6475E9"
                ></path>
              </g>
              <mask id="homeMask">
                <path
                  d="M251.443 379.995C343.8 522.546 72.7626 653.05 150.047 793.593C227.332 934.136 373.91 810.659 426.127 683.167C478.345 555.674 614.246 239.654 720.255 240.457C852.767 241.46 853.771 366.945 801.569 448.259C749.367 529.573 655.003 599.844 749.367 719.306C843.732 838.767 964.197 558.686 1019.41 487.41C1074.62 416.135 1249.87 459.35 1211.15 584.786C1172.43 710.223 1075.97 890.3 972.237 931.124"
                  stroke="white"
                  strokeWidth="120"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  strokeDashoffset="0px"
                  strokeDasharray="1px 1px"
                ></path>
              </mask>
            </svg>
          </div>
          <div
            className="relative z-[20] mx-auto -mb-28 aspect-[423/870] w-full max-w-[247px] md:-mb-[34%] md:max-w-[423px]"
            style={{ opacity: 1, transform: "translateY(0px)" }}
          >
            <div
              className="absolute inset-0"
              style={{ transform: "translateY(-2.01735%)" }}
            >
              <div className="relative h-full w-full undefined">
                <div className="relative h-full w-full" style={{ opacity: 1 }}>
                  <div className="canvas h-full w-full">
                    <canvas
                      style={{
                        verticalAlign: "top",
                        width: "247px",
                        height: "508px",
                      }}
                      width="494"
                      height="1016"
                    ></canvas>
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
