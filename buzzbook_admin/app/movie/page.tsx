"use client";

import React from "react";
import { useMovies } from "@/app/context/movieContext";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import AddMovieForm from "@/components/forms/addMovieForm";
import { useRouter } from "next/navigation";

const Page = () => {
  const { movies, loading, error } = useMovies();
  const router = useRouter();
  const handleAddMovie = () => {
    router.push("/add_movie"); 
  };
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 via-black to-gray-800 min-h-screen min-w-full text-white">
       <Button onClick={handleAddMovie} className="mb-4">
        Add Movie
      </Button>
      {loading && <p>Loading movies...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            title={movie.title}
            releaseDate={movie.release_date}
            rating={ movie.rating}
            posterUrl={movie.poster_img[0]}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
