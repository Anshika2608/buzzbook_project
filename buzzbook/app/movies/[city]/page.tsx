"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocation } from "@/app/context/LocationContext";
import MovieCard from "@/components/card/MovieCard";


const MoviesPage = () => {
  const { city, setCity, movies } = useLocation();
  const params = useParams<{ city: string }>();

  const cityFromUrl = params.city;

  useEffect(() => {
    if (cityFromUrl && cityFromUrl !== city) {
      setCity(cityFromUrl);
    }
  }, [cityFromUrl, city, setCity]);
  console.log("Movies :",movies)

  return (
    <div className="p-4 sm:p-6 md:p-8 movie min-h-screen">
            <h1 className="mb-4 text-center text-xl font-bold text-white sm:text-2xl md:text-3xl">Movies in {cityFromUrl}</h1>
            <div className="grid grid-cols-2 max-[400px]:grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie}  />
                ))}
            </div>
        </div>
  );
};

export default MoviesPage;
