"use client";

import { useEffect, useState } from "react";
import AdSenseSlot from "./AdSenseSlot";

type AdPlacement = {
  _id: string;
  location: string;
  adCode: string;
  isActive: boolean;
};

export default function AdPlacementZone({ location }: { location: string }) {
  const [adCode, setAdCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadAd() {
      try {
        const response = await fetch("/api/ads");
        const json = await response.json();
        if (!response.ok || !json.success || !Array.isArray(json.data)) return;

        const placement = json.data.find(
          (item: AdPlacement) => item.location === location && item.isActive,
        );

        if (placement?.adCode) {
          setAdCode(placement.adCode);
        }
      } catch (error) {
        console.error("Failed to load AdSense placement:", error);
      }
    }

    loadAd();
  }, [location]);

  if (!adCode) return null;

  return (
    <div className="w-full my-10">
      <AdSenseSlot adCode={adCode} />
    </div>
  );
}
