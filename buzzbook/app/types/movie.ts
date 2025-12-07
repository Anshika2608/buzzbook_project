
export interface Reviews{
   critic_name: string;
  rating: number;
  review: string;
  _id: string;
  helpful_count:number
}
export interface Cast{
  name:string,
  role:string,
  photo:string,
}
export interface Movie {
  _id: string;
  title: string;
  description: string;
  type: string;
  genre: string[];
  rating: number;
  poster_img: string[];
  release_date: string;
  cast:Cast[];
  director: string;
  production_house: string;
  language: string[];
  trailer: string[];
  reviews: Reviews[];
  duration:number;
  certification:string
  industry:string
  Type:string
  theaterId:string

}

export interface ApiResponse {
  movies: Movie[];
}

export interface CarouselMovie {
    _id: string;
    title: string;
    poster: string; 
    releaseDate: string;
    description?: string;
}
export interface Wishlist {
  _id:string,
    title: string;
  poster_img?: string[];
  genre?: string[];
  theaterId?: string | null;
  name?:string,
  address?:string,
  facilities?:[]

}