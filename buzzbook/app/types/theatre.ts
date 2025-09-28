
export interface Showtime {
  theatre_id: string;
  title: string;
  time:string;
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
  location:Location
  theater_id:string,
  cancellationAvailable:boolean,
  facilities:[],
  showtimes:Showtime[],

}

export interface Location {
  city:string,
  country:string,
  state:string
}

export interface SeatLayout{
  seat_number: string;
  type: "REGULAR" | "VIP" | "PREMIUM"; 
  is_booked: boolean;
  is_held: boolean;
  hold_expires_at: string | null;
  _id: string;
}
