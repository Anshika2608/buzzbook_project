"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type Movie = {
  _id: string;
  title: string;
  release_date: string;
  poster_img: string[];
  rating: number;
  genre: string[];
  description?: string;
  type?: string;
  cast?: string[];
  director?: string;
  production_house?: string;
  language?: string[];
  trailer?: string[];
};

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id;
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;
      try {
        const res = await axios.get(
          `https://buzzbook-server-dy0q.onrender.com/movie/movieDetails/${movieId}`
        );
        setMovie(res.data.movie);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-purple-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        No movie found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className=" w-full bg-gradient-to-b from-purple-900 to-black rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={movie.poster_img?.[0] || "/fallback.jpg"}
            alt={movie.title}
            className="w-72 h-auto rounded-xl shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-purple-400 mb-3">
              {movie.title}
            </h1>
            <p className="text-gray-300 mb-4">
              {movie.description || "No description available."}
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 bg-purple-700 text-sm rounded-full shadow"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-400">
              <span className="font-semibold text-purple-300">
                Type:
              </span>{" "}
              {movie.type}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-purple-300">
                Release Date:
              </span>{" "}
              {new Date(movie.release_date).toDateString()}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-purple-300">Rating:</span> ⭐{" "}
              {movie.rating}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-purple-300">Language:</span>{" "}
              {movie.language?.join(", ")}
            </p>
          </div>
        </div>

        {/* Extra Info */}
        <div className="space-y-3">
          <p className="text-gray-400">
            <span className="font-semibold text-purple-300">Director:</span>{" "}
            {movie.director}
          </p>
          <p className="text-gray-400">
            <span className="font-semibold text-purple-300">
              Production House:
            </span>{" "}
            {movie.production_house}
          </p>
          <div>
            <span className="font-semibold text-purple-300">Cast:</span>
            <ul className="list-disc list-inside text-gray-400 ml-4">
              {movie.cast?.map((actor) => (
                <li key={actor}>{actor}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trailer Section (placeholder) */}
        {movie.trailer && movie.trailer.length > 0 ? (
          <div className="w-full mt-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-3">
              Trailer
            </h2>
            <iframe
              src={movie.trailer[0]}
              title="Trailer"
              className="w-full h-96 rounded-xl shadow-lg"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-gray-500 italic mt-6">
            No trailer available.
          </p>
        )}

        {/* Edit Button */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/movie/${movie._id}/edit`)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition text-white font-semibold"
          >
            ✏️ Edit Movie
          </button>
        </div>
      </div>
    </div>
  );
}
