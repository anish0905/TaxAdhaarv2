"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSenseSlotProps {
  adCode: string;
  className?: string;
}

export default function AdSenseSlot({ adCode, className = "" }: AdSenseSlotProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense init failed:", error);
    }
  }, [adCode]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
}
