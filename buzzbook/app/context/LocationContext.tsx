// "use client"
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";
// import { route } from "@/lib/api";

// type LocationContextType = {
//   city: string;
//   setCity: (city: string) => void;
//   cities:string[];
// };

// const LocationContext = createContext<LocationContextType | undefined>(undefined);

// export const LocationProvider = ({ children }: { children: ReactNode }) => {
//     const[city,setCity] = useState<string>("");
//     const[cities,setCities] = useState<string[]>([]);

//     useEffect(()=>{
//         const fetchLocation = async()=> {
//             try{
//               const res = await axios.get(route.location);
//               setCity(res.data.city);
//             }catch(error){
//                 console.log("Error fetching Location",error)
//             }
//         }
//           fetchLocation();
//     },[])
//       return (
//     <LocationContext.Provider value={{ city, setCity }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };
// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) {
//     throw new Error("useLocation must be used within a LocationProvider");
//   }
//   return context;
// };

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { route } from "@/lib/api";

type LocationContextType = {
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  isOpen:boolean,
  setIsOpen: (isOpen: boolean) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCityState] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const[isOpen,setIsOpen] = useState<boolean>(false);

  const setCity = (newCity: string) => {
    setCityState(newCity);
    localStorage.setItem("selectedCity", newCity);
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(route.location); // API that returns all cities
        setCities(res.data);
          console.log("Fetched Cities:", res.data);
        const savedCity = localStorage.getItem("selectedCity");
        if (savedCity) {
          setCityState(savedCity);
        }else {
          setCityState("Lucknow"); // ✅ Default city
          localStorage.setItem("selectedCity", "Lucknow");
        }
      } catch (error) {
        console.log("Error fetching cities", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <LocationContext.Provider value={{ city, setCity, cities,isOpen,setIsOpen }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

