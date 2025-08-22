"use client"
import {useEffect,createContext,useState,useContext,ReactNode} from 'react';
import axios from "axios";
import { getSocket } from "@/app/socket";
type Movie={
    _id:string,
    title:string,
    release_date:Date,
    poster_img:String,
    rating:number,
    genre:String[]
}
type MovieContextType={
    loading:boolean,
    movies:Movie[],
    fetchMovies:()=>Promise<void>,
    error:string|null
    // deleteMovie:(id:String)=>Promise<void>,
}
const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // ✅ Fetch movies
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
       const res = await axios.get("https://buzzbook-server-dy0q.onrender.com/movie/movie_list");
      setMovies(res.data.listOfMovies);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  // ✅ Delete movie
//   const deleteMovie = async (id: string) => {
//     try {
//       const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete movie");
//       setMovies((prev) => prev.filter((m) => m._id !== id));
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

  // Load movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider
      value={{ movies, loading, error, fetchMovies }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// ✅ Hook for consuming context
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};