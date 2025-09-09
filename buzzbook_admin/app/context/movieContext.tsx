"use client";
import { useEffect, createContext, useState, useContext } from "react";
import axios from "axios";
import { getSocket } from "@/app/socket";

type Movie = {
  _id: string;
  title: string;
  release_date: string;
  poster_img: string[];
  rating: number;
  genre: string[];
  description?: string;
  language?: string;
};

type MovieContextType = {
  loading: boolean;
  movies: Movie[];
  fetchMovies: () => Promise<void>;
  error: string | null;
  deleteMovie: (id: string) => Promise<void>;
  // getMovieById: (id: string) => Promise<void>;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Api_url = "https://buzzbook-server-dy0q.onrender.com";

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${Api_url}/movie/movie_list`);
      setMovies(res.data.listOfMovies || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const res = await axios.delete(`${Api_url}/movie/deleteMovie/${id}`);
      if (res.status === 200) {
        setMovies((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  // const getMovieById = async (id: string) => {
  //   try {
  //     const res = await axios.get(`${Api_url}/movie`,{
  //       params:
  //     });
  //     setMovie(res.data.movie);
  //     setError(null);
  //   } catch (err: unknown) {
  //     if (axios.isAxiosError(err)) {
  //       setError(err.response?.data?.message || err.message);
  //     } else if (err instanceof Error) {
  //       setError(err.message);
  //     } else {
  //       setError("An unexpected error occurred");
  //     }
  //   }
  // }
  useEffect(() => {
    fetchMovies();

    const socket = getSocket();

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socket.on("movieDeleted", (movieId: string) => {
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
    });

    socket.on("movieAdded", (newMovie: Movie) => {
      setMovies((prev) => [...prev, newMovie]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });

    return () => {
      socket.off("movieDeleted");
      socket.off("movieAdded");
      socket.disconnect();
    };
  }, []);

  return (
    <MovieContext.Provider
      value={{ movies, loading, error, fetchMovies, deleteMovie }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
