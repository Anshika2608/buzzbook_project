import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),

  language: z.string().regex(/^[A-Za-z\s]+$/, "Only letters are allowed"),

  release_date: z.string().nonempty("Release date is required"),

  genre: z.string().regex(/^[A-Za-z\s,]+$/, "Enter valid genres separated by commas"),

  Type: z.string().min(2, "Type is required"),

  duration: z.coerce.number().min(30, "Duration must be at least 30 minutes").max(500, "Duration cannot exceed 500 minutes"),

  rating: z.coerce.number().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10"),

  production_house: z.string().min(2, "Production house required"),

  director: z.string().min(2, "Director name required"),

  
  cast: z.string().regex(/^[A-Za-z\s,]+$/, "Enter valid cast names separated by commas"),
  
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  adult: z.enum(["true", "false"], "Select adult option"),
});
