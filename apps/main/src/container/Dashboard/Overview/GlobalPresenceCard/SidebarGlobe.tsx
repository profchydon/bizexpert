"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function SidebarGlobe() {
  const [animation, setAnimation] = useState<object | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/lottie/globe.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setAnimation(data);
      })
      .catch(() => {
        if (active) setAnimation(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative aspect-square w-full max-w-[268px]">
        <img
          src="/images/dashboard/global-presence-sphere.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        />
        {animation ? (
          <Lottie
            animationData={animation}
            loop
            autoplay
            className="absolute inset-0 size-full"
          />
        ) : null}
      </div>
    </div>
  );
}
