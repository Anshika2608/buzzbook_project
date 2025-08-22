import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {Button} from "@/components/ui/button"
type MovieCardProps = {
  title: string;
  releaseDate: string | Date;
  rating: number | string;
  posterUrl: string;
  className?: string;
};

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Rating: React.FC<{ value: number | string }> = ({ value }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-purple-500 bg-purple-900/40 px-2 py-0.5 text-xs font-medium text-purple-300">
      <span>{value}</span>
    </div>
  );
};

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  releaseDate,
  rating,
  posterUrl,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      <Card className="overflow-hidden rounded-2xl border border-purple-700 bg-black shadow-md hover:shadow-purple-600/40 transition-all">
        
        <CardContent className="pt-0">
          <div className="relative w-full overflow-hidden rounded-xl">
            <img
              src={posterUrl}
              alt={`${title} poster`}
              className="h-[300px] w-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </CardContent>

        
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-white">
            {title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <Badge
              variant="secondary"
              className="rounded-full bg-purple-800/50 text-purple-200 border border-purple-600"
            >
              Release: {formatDate(releaseDate)}
            </Badge>
            <Rating value={rating} />
            <Button className="h-10 w-16 border-2 border-purple-600">Delete</Button>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default MovieCard;

// Example usage:
// <MovieCard
//   title="Inception"
//   releaseDate="2010-07-16"
//   rating="U/A"
//   posterUrl="https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfft
