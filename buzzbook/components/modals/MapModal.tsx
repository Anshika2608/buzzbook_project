"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // shadcn dialog
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  address: string;
};

export default function MapModal({ isOpen, onClose, address }: MapModalProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Geocode the address into lat/lng
  useEffect(() => {
    if (isLoaded && isOpen && address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          setCoords({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        }
      });
    }
  }, [isLoaded, isOpen, address]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[500px] p-0 overflow-hidden">
        {!isLoaded || !coords ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={coords}
            zoom={15}
          >
            <Marker position={coords} />
          </GoogleMap>
        )}
      </DialogContent>
    </Dialog>
  );
}
