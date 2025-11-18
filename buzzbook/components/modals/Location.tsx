"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "@/app/context/LocationContext";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

const Location = () => {
  const { city, setCity, cities, isOpen, setIsOpen } = useLocation();
  const router = useRouter();

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setIsOpen(false);
    localStorage.setItem("selectedCity", selectedCity);
    router.push(`/movies/${selectedCity}`);
  };

  // ⭐ DYNAMIC ICON MAPPING (edit anytime)
  const cityIcons: Record<string, string> = {
    Delhi: "/locationIcons/delhi.png",
    Mumbai: "/locationIcons/mumbai.png",
    Agra: "/locationIcons/agra.png",
    Jaipur: "/locationIcons/jaipur.png",
    Lucknow: "/locationIcons/lucknow.png",
    Pune: "/locationIcons/pune.png",
    Indore: "/locationIcons/indore.png",
    Bhopal: "/locationIcons/bhopal.png"
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <DialogTrigger className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-all">
        <MapPin className="w-4 h-4 text-white" />
        {city ? `${city}` : "Location"}
      </DialogTrigger>

      <DialogContent className="bg-black/95 text-white border border-gray-800 backdrop-blur-xl shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-purple-400 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Select Your City
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose your city to get relevant movie and theatre listings.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {cities.length > 0 ? (
            cities.map((c) => {
              const icon = cityIcons[c] || "/locationIcons/default.png"; // fallback icon

              return (
                <button
                  key={c}
                  onClick={() => handleCitySelect(c)}
                  className="
                    flex flex-col items-center p-2 rounded border 
                    border-gray-700 
                    hover:border-purple-500 
                    hover:bg-purple-500/10 
                    transition-all 
                    max-h-24
                    shadow-sm hover:shadow-purple-500/20
                  "
                >
                  <img
                    src={icon}
                    className="h-14 w-12 rounded-md"
                    alt={c}
                  />
                  <span className="mt-1 text-sm font-medium">{c}</span>
                </button>
              );
            })
          ) : (
            <p className="col-span-2 text-center text-gray-400">
              Loading cities...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Location;





// "use client";

// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useLocation } from "@/app/context/LocationContext";

// const Location = () => {
//   const { city, setCity, cities, isOpen, setIsOpen } = useLocation();

//   const handleCitySelect = (selectedCity: string) => {
//     setCity(selectedCity);
//     setIsOpen(false); // Close modal
//   };

//   const handleDetectLocation = async () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         // Reverse geocode using a free API like OpenStreetMap Nominatim or Google Maps API
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//         );
//         const data = await response.json();

//         const detectedCity = data.address?.city || data.address?.state || null;

//         if (detectedCity) {
//           // Check if the detected city is in our cities list
//           const matchedCity = cities.find(
//             (c) => c.toLowerCase() === detectedCity.toLowerCase()
//           );

//           if (matchedCity) {
//             setCity(matchedCity);
//             setIsOpen(false);
//           } else {
//             alert(`Detected city "${detectedCity}" is not available in our list.`);
//           }
//         } else {
//           alert("Could not detect city from your location.");
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//         alert("Unable to detect location. Please enable location services.");
//       }
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded">
//         {city ? `City: ${city}` : "Select Location"}
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Select Your City</DialogTitle>
//           <DialogDescription>
//             Choose your city or let us detect your current location.
//           </DialogDescription>
//         </DialogHeader>

//         {/* Detect Location Button */}
//         <button
//           onClick={handleDetectLocation}
//           className="w-full p-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           Detect My Location
//         </button>

//         <div className="grid grid-cols-2 gap-2">
//           {cities.length > 0 ? (
//             cities.map((c) => (
//               <button
//                 key={c}
//                 onClick={() => handleCitySelect(c)}
//                 className={`p-2 rounded border ${
//                   c === city ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {c}
//               </button>
//             ))
//           ) : (
//             <p className="col-span-2 text-center text-gray-500">Loading cities...</p>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default Location;
