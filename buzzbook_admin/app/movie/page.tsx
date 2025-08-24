"use client";

import React from "react";
import { useMovies } from "@/app/context/movieContext";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const { movies, loading, error } = useMovies();
  const router = useRouter();
  const handleAddMovie = () => {
    router.push("/add_movie");
  };
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 via-black to-gray-800 min-h-screen min-w-full text-white">
      <div className="relative flex justify-center items-center mb-4 pt-4">
        <h1 className="text-purple-400 font-bold text-2xl sm:text-3xl ">Movies</h1>

        <Button
          onClick={handleAddMovie}
          className="absolute right-0 h-10  w-20 sm:w-24 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
        >
          Add Movie
        </Button>
      </div>

      {loading && <p>Loading movies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            _id={movie._id}
            title={movie.title}
            releaseDate={movie.release_date}
            rating={movie.rating}
            posterUrl={movie.poster_img[0]}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
