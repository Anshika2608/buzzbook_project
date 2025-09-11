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
import { createContext, useContext, useState, useEffect, ReactNode,useCallback } from "react";
import axios from "axios";
import { route } from "@/lib/api";
import { Movie } from "@/app/types/movie";
import { Theatre } from "@/app/types/theatre";
import { CarouselMovie } from "@/app/types/movie";

type LocationContextType = {
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  movies: Movie[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchMovieDetails: (id: string) => Promise<Movie | null>;
  fetchTheatres: (title: string, location: string) => Promise<void>;
    fetchPriceRanges: (movie: string, city: string) => Promise<void>
  theatres: Theatre[];
  movieDet: Movie | null;
   priceRanges: string[];
     fetchFilteredTheatresPrice: (movie: string, city: string, priceRange: string) => Promise<void>;
      comingSoonMovies: CarouselMovie[];
 isLoadingComingSoon: boolean;
fetchUniqueShowTime: (city:string,selectedRange:string,movieTitle:string) => Promise<void>


};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCityState] = useState<string>("Lucknow");
  const [cities, setCities] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [movieDet, setMovieDet] = useState<Movie | null>(null);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([])
    const [comingSoonMovies, setComingSoonMovies] = useState<CarouselMovie[]>([]);
    const [isLoadingComingSoon, setIsLoadingComingSoon] = useState(true);



  // ✅ fetch movies in a city
  const fetchMovies = async (selectedCity: string) => {
    try {
      const res = await axios.get(`${route.movie}?location=${selectedCity}`);
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error("Error fetching movies", err);
      setMovies([]);
    }
  };

  //  fetch details for one movie
const fetchMovieDetails = useCallback(async (id: string): Promise<Movie | null> => {
  try {
    const res = await axios.get(`${route.movieDetails}${id}`);
    setMovieDet(res.data.movie);
    return res.data.movie;
  } catch (err) {
    console.error("Error fetching movie details", err);
    return null;
  }
}, []);

  // ✅ fetch theatres + auto-fetch showtimes for each theatre
  const fetchTheatres = async (title: string, location: string): Promise<void> => {
    try {
      const res = await axios.get(`${route.theatre}`, {
        params: { title, location },
      });

      const theatreList: Theatre[] = res.data.theaterData || [];

      // fetch showtimes for each theatre in parallel
      const theatresWithShowtimes = await Promise.all(
        theatreList.map(async (t) => {
          try {
            const showtimeRes = await axios.get(`${route.showtime}`, {
              params: { theater_id: t.theater_id, movie_title: title },
            });
            return { ...t, showtimes: showtimeRes.data.showtimes || [] };
          } catch (err) {
            console.error(`Error fetching showtimes for theatre ${t._id}`, err);
            return { ...t, showtimes: [] };
          }
        })
      );

      setTheatres(theatresWithShowtimes);
    } catch (err) {
      console.error("Error fetching theatres", err);
      setTheatres([]);
    }
  };

  //Price Range
  const fetchPriceRanges = async (movie: string, city: string): Promise<void> => {
  try {
    const res = await axios.get(`${route.priceRange}`, {
      params: { movie, city },
    })
    setPriceRanges(res.data.availablePriceRanges ||[])
  } catch (err) {
    console.error("Error fetching price ranges", err)
    setPriceRanges([])
  }
}

// fetch theatre - by price range 
 const fetchFilteredTheatresPrice = async (movie: string, city: string, priceRange: string) => {
    try {
      const res = await axios.get(`${route.theatreByPrice}`, {
        params: { movie, city, priceRange },
      });
      const data = Array.isArray(res.data) ? res.data : res.data?.theaters ?? []
      setTheatres(data);
    } catch (err) {
      console.error("Error fetching filtered theatres", err);
      setTheatres([]);
    }
  };
// show theatre based on time
  const fetchUniqueShowTime = async( city: string, selectedRange: string,movieTitle:string) => {
    try{
const res = await axios.get(`${route.uniqueTime}`,{
  params:{city,selectedRange,movieTitle}
})
 const data = Array.isArray(res.data) ? res.data : res.data?.theaters ?? []
      setTheatres(data);
    }catch (err) {
      console.error("Error fetching filtered theatres", err);
      setTheatres([]);
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
      } catch (error) {
        console.error("Error fetching cities", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    fetchMovies(city);
  }, [city]);

  //fetch coming soon 
  const fetchComingSoonMovies = async () => {
  setIsLoadingComingSoon(true);
  try {
    const res = await axios.get(route.comingSoon);
    console.log("Raw API response:", res.data);   // 👈 check API shape here

    const transformed: CarouselMovie[] = (res.data.movies || []).map((movie: Movie) => ({
      _id: movie._id,
      title: movie.title,
      poster: movie.poster_img[0],
      releaseDate: movie.release_date,
      description: movie.description || "Get ready for an unforgettable cinematic experience. Coming soon to a theatre near you.",
    }));

    console.log("Transformed movies:", transformed); // 👈 check if array has elements

    setComingSoonMovies(transformed);
  } catch (err) {
    console.error("Error fetching coming soon movies", err);
    setComingSoonMovies([]);
  } finally {
    setIsLoadingComingSoon(false);
  }
};
  useEffect(() => {
  const fetchInitial = async () => {
    try {
      const citiesRes = await axios.get(route.location);
      setCities(citiesRes.data.cities || citiesRes.data);
    } catch (err) {
      console.error("Error fetching cities", err);
    }
  };

  fetchInitial();
  fetchComingSoonMovies();
}, []);



  return (
    <LocationContext.Provider
      value={{
        city,
        setCity,
        cities,
        movies,
        isOpen,
        setIsOpen,
        fetchMovieDetails,
        movieDet,
        fetchTheatres,
        theatres,
        fetchPriceRanges,priceRanges,
          fetchFilteredTheatresPrice,
          comingSoonMovies,
        isLoadingComingSoon,
fetchUniqueShowTime
      }}
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
