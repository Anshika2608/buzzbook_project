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
import { Theatre } from "@/app/types/theatre";

type LocationContextType = {
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  movies: Movie[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchMovieDetails: (id: string) => Promise<Movie | null>;
  fetchTheatres: (title: string,location:string) => Promise<void>;
  theatres: Theatre[];
  movieDet: Movie | null;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCityState] = useState<string>("Lucknow"); 
  const [cities, setCities] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>
  (false);
const [movieDet, setMovieDet] = useState<Movie | null>(null);

   const [theatres, setTheatres] = useState<Theatre[]>([]);
  

  const fetchMovies = async (selectedCity: string) => {
    try {
      const res = await axios.get(`${route.movie}?location=${selectedCity}`);
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error("Error fetching movies", err);
      setMovies([]);
    }
  };
  const fetchMovieDetails = async (id: string): Promise<Movie | null> => {
  try {
    const res = await axios.get(`${route.movieDetails}${id}`);
    setMovieDet(res.data.movie );
    return res.data.movie;

  } catch (err) {
    console.error("Error fetching movie details", err);
    return null;
  }
};
const fetchTheatres = async (title: string, location: string): Promise<void> => {
  try {
    const res = await axios.get(`${route.theatre}`, {
      params: { title, location },
    })
    setTheatres(res.data.theaterData || [])
    console.log(res.data.theaterData);
  } catch (err) {
    console.error("Error fetching theatres", err)
    setTheatres([])
  }
}


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
        console.log(res.data.cities)
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
      value={{ city, setCity, cities, movies, isOpen, setIsOpen ,fetchMovieDetails,movieDet,fetchTheatres,theatres}}
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
