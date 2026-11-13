"use client";

import { Search } from "lucide-react";

export function CloudEmptyStateIllustration() {
  return (
    <div className="relative h-32 w-[172px]" role="img" aria-label="No results">
      <svg viewBox="0 0 182 137" fill="none" className="h-full w-full">
        <circle cx="91" cy="64" r="64" fill="#F5F5F5" />
        <circle cx="25" cy="20" r="6" fill="#F5F5F5" />
        <circle cx="22" cy="112" r="8" fill="#F5F5F5" />
        <circle cx="165" cy="36" r="8" fill="#F5F5F5" />
        <circle cx="154" cy="9" r="5" fill="#F5F5F5" />

        <g filter="url(#catalog-cloud-filter)">
          <path
            d="M93 16C79.534 16 67.6222 22.6541 60.3733 32.8536C58.0062 32.2954 55.5376 32 53 32C35.3269 32 21 46.3269 21 64C21 81.6731 35.3269 96 53 96H133C148.464 96 161 83.464 161 68C161 52.536 148.464 40 133 40C131.902 40 130.818 40.0633 129.752 40.1863C123.623 25.9596 109.475 16 93 16Z"
            fill="#FAFAFA"
          />
          <path
            d="M93 15.5C79.4856 15.5 67.5173 22.1198 60.161 32.2916C57.8566 31.7734 55.4599 31.5 53 31.5C35.0507 31.5 20.5 46.0507 20.5 64C20.5 81.9493 35.0507 96.5 53 96.5H133C148.74 96.5 161.5 83.7401 161.5 68C161.5 52.2599 148.74 39.5 133 39.5C132.009 39.5 131.029 39.5506 130.064 39.6495C123.78 25.427 109.55 15.5 93 15.5Z"
            stroke="black"
            strokeOpacity="0.08"
          />
          <circle
            cx="53"
            cy="64"
            r="32"
            fill="url(#catalog-cloud-gradient-1)"
          />
          <circle
            cx="93"
            cy="56"
            r="40"
            fill="url(#catalog-cloud-gradient-2)"
          />
          <circle
            cx="133"
            cy="68"
            r="28"
            fill="url(#catalog-cloud-gradient-3)"
          />
        </g>

        <defs>
          <filter
            id="catalog-cloud-filter"
            x="0"
            y="15"
            width="182"
            height="122"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="1.5"
              operator="erode"
              in="SourceAlpha"
              result="effect-1"
            />
            <feOffset dy="3" />
            <feGaussianBlur stdDeviation="1.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.04 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect-1" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="4"
              operator="erode"
              in="SourceAlpha"
              result="effect-2"
            />
            <feOffset dy="8" />
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.03 0"
            />
            <feBlend mode="normal" in2="effect-1" result="effect-2" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="4"
              operator="erode"
              in="SourceAlpha"
              result="effect-3"
            />
            <feOffset dy="20" />
            <feGaussianBlur stdDeviation="12" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.08 0"
            />
            <feBlend mode="normal" in2="effect-2" result="effect-3" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect-3"
              result="shape"
            />
          </filter>
          <linearGradient
            id="catalog-cloud-gradient-1"
            x1="28.4286"
            y1="42.8571"
            x2="85"
            y2="96"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E9EAEB" />
            <stop offset="0.350715" stopColor="#FAFAFA" />
          </linearGradient>
          <linearGradient
            id="catalog-cloud-gradient-2"
            x1="62.2857"
            y1="29.5714"
            x2="133"
            y2="95.9999"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E9EAEB" />
            <stop offset="0.350715" stopColor="#FAFAFA" />
          </linearGradient>
          <linearGradient
            id="catalog-cloud-gradient-3"
            x1="111.5"
            y1="49.5"
            x2="161"
            y2="96"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E9EAEB" />
            <stop offset="0.350715" stopColor="#FAFAFA" />
          </linearGradient>
        </defs>
      </svg>

      <span className="absolute bottom-3 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm">
        <Search className="h-7 w-7 stroke-[2px]" />
      </span>
    </div>
  );
}
