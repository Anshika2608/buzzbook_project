
export interface Showtime {
  _id: string;
  time: string;
}

export interface FilmShowing {
  _id: string;
  title: string;
  language: string;
  showtimes: Showtime[];
}

export interface Audi {
  _id: string;
  audi_number: string;
  films_showing: FilmShowing[];
}

export interface Theatre {
  _id: string;
  name: string;
  address: string;
  contact: string;
  popular: boolean;
  audis: Audi[];
  location:Location[]
}

export interface Location {
  city:string,
  country:string,
  state:string
}
