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
import { Movie } from "@/app/types/movie";

type LocationContextType = {
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  movies: Movie[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCityState] = useState<string>("Lucknow"); 
  const [cities, setCities] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchMovies = async (selectedCity: string) => {
    try {
      const res = await axios.get(`${route.movie}?location=${selectedCity}`);
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error("Error fetching movies", err);
      setMovies([]);
    }
  };

  const setCity = (newCity: string) => {
    setCityState(newCity);
    localStorage.setItem("selectedCity", newCity);
  };


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCity = localStorage.getItem("selectedCity");
      if (savedCity) setCityState(savedCity);
    }
  }, []);

 
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(route.location);
        setCities(res.data.cities || res.data);
      } catch (error) {
        console.error("Error fetching cities", error);
      }
    };
    fetchCities();
  }, []);


  useEffect(() => {
    fetchMovies(city);
  }, [city]);

  return (
    <LocationContext.Provider
      value={{ city, setCity, cities, movies, isOpen, setIsOpen }}
    >
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
