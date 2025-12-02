"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { route } from "@/lib/api";
import { Movie, Wishlist } from "@/app/types/movie";
import {Theatre } from "@/app/types/theatre";
import { CarouselMovie } from "@/app/types/movie";
import api from "@/lib/interceptor";
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
  fetchUniqueShowTime: (city: string, selectedRange: string, movieTitle: string) => Promise<void>
  addToWishlist: (movieId: string, theaterId: string | null) => Promise<void>;
  wishlistMovies: Wishlist[];
   wishlistTheater: Wishlist[];
  getWishlist:()=>Promise<void>;
  addReview: (
  movieId: string,
  payload: { critic_name: string; rating: number; review: string }
) => Promise<void>;
getReviewReplies: (movieId: string, reviewId: string) => Promise<void>;
addReply: (movieId: string, reviewId: string, reply: string) => Promise<void>;

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
  const [wishlistMovies, setWishlistMovies] = useState<Wishlist[]>([]);
  const [wishlistTheater, setWishlistTheater] = useState<Wishlist[]>([]);


  // ✅ fetch movies in a city
  const fetchMovies = async (selectedCity: string) => {
    try {
      const res = await api.get(`${route.movie}?location=${selectedCity}`);
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error("Error fetching movies", err);
      setMovies([]);
    }
  };

  //  fetch details for one movie
  const fetchMovieDetails = useCallback(async (id: string): Promise<Movie | null> => {
    try {

      const res = await api.get(`${route.movieDetails}${id}`);
      setMovieDet(res.data.movie);
      getWishlist();
      return res.data.movie;
    } catch (err) {
      console.error("Error fetching movie details", err);
      return null;
    }
  }, []);

  // ✅ fetch theatres + auto-fetch showtimes for each theatre
  const fetchTheatres = async (title: string, location: string): Promise<void> => {
    try {
      const res = await api.get(`${route.theatre}`, {
        params: { title, location },
      });

      const theatreList: Theatre[] = res.data.theaterData || [];

      // fetch showtimes for each theatre in parallel
      const theatresWithShowtimes = await Promise.all(
        theatreList.map(async (t) => {
          try {
            const showtimeRes = await api.get(`${route.showtime}`, {
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
      const res = await api.get(`${route.priceRange}`, {
        params: { movie, city },
      })
      setPriceRanges(res.data.availablePriceRanges || [])
    } catch (err) {
      console.error("Error fetching price ranges", err)
      setPriceRanges([])
    }
  }

  // fetch theatre - by price range 
  const fetchFilteredTheatresPrice = async (movie: string, city: string, priceRange: string) => {
    try {
      const res = await api.get(`${route.theatreByPrice}`, {
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
  const fetchUniqueShowTime = async (city: string, selectedRange: string, movieTitle: string) => {
    try {
      const res = await api.get(`${route.uniqueTime}`, {
        params: { city, selectedRange, movieTitle }
      })
      const data = Array.isArray(res.data) ? res.data : res.data?.theaters ?? []
      setTheatres(data);
    } catch (err) {
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
        const res = await api.get(route.location);
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

//wishlist
const addToWishlist = async (movieId: string, theaterId: string | null) => {
  console.log("thaeater",theaterId)
  try {
    const res = await api.post(`${route.wishlist}/add`, {
      movieId,
      theaterId,
    });
    await getWishlist();
    return res.data;
  } catch (err) {
    console.error("❌ Error adding to wishlist", err);
    throw err;
  }
};
//get wishlist 
const getWishlist = async () => {
  try {
    const res = await api.get(`${route.wishlist}`);
    setWishlistMovies(res.data.wishlist.movies || []);
    setWishlistTheater(res.data.wishlist.theaters || [])
    
  } catch (err) {
    console.error("❌ Error fetching wishlist", err);
    setWishlistMovies([]);
    setWishlistTheater([])
  }
};

  useEffect(() => {
    getWishlist();
  }, []);

  //fetch coming soon 
  const fetchComingSoonMovies = async () => {
    setIsLoadingComingSoon(true);
    try {
      const res = await api.get(route.comingSoon);
      // 👈 check API shape here

      const transformed: CarouselMovie[] = (res.data.movies || []).map((movie: Movie) => ({
        _id: movie._id,
        title: movie.title,
        poster: movie.poster_img[0],
        releaseDate: movie.release_date,
        description: movie.description || "Get ready for an unforgettable cinematic experience. Coming soon to a theatre near you.",
      }));

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
        const citiesRes = await api.get(route.location);
        setCities(citiesRes.data.cities || citiesRes.data);
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };

    fetchInitial();
    fetchComingSoonMovies();
  }, []);

const addReview = async (
  movieId: string,
  payload: {
    critic_name: string;
    rating: number;
    review: string;
  }
) => {
  try {
    const res = await api.post(`${route.review}/${movieId}/reviews`, payload);
    await fetchMovieDetails(movieId);

    return res.data;
  } catch (err) {
    console.error("❌ Error adding review", err);
    throw err;
  }
};

const getReviewReplies = async (movieId: string, reviewId: string) => {
  try {
    const res = await api.get(`${route.review}/${movieId}/reviews/${reviewId}/replies`);
    return res.data.replies || [];
  } catch (err: any) {
    console.error("❌ Error fetching review replies", err.response?.data || err.message);
    return [];
  }
};

const addReply = async (movieId: string, reviewId: string, reply: string) => {
  try {
    const res = await api.post(
      `${route.review}/${movieId}/reviews/${reviewId}/replies`,
      reply
    );

    // Optional: Refresh movie details so UI updates automatically
    await fetchMovieDetails(movieId);
    await getReviewReplies(movieId,reviewId)
    return res.data;
  } catch (err: any) {
    console.error("❌ Error adding reply", err.response?.data || err.message);
    throw err;
  }
};




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
        fetchPriceRanges,
        priceRanges,
        fetchFilteredTheatresPrice,
        comingSoonMovies,
        isLoadingComingSoon,
        fetchUniqueShowTime,
        addToWishlist,
        wishlistMovies,
        getWishlist,
        wishlistTheater,
        addReview,
        getReviewReplies,
        addReply
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
