export interface Movie {
  _id: string;
  title: string;
  description: string;
  type: string;
  genre: string[];
  rating: number;
  poster_img: string[];
  release_date: string;
  cast: string[];
  director: string;
  production_house: string;
  language: string[];
  trailer: string[];
}