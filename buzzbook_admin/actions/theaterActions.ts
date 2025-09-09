// lib/theaterActions.ts
import axios from "axios";

export const addAudi = async (theaterId: string, formData: any) => {
  const preparedForm = {
    ...formData,
    films_showing: formData.films_showing.map((film: any) => ({
      ...film,
      showtimes: film.showtimes.map((showtime: any) => {
        const prices: Record<string, number> = {};
        Object.keys(showtime.prices).forEach((type) => {
          prices[type] = Number(showtime.prices[type] || 0);
        });
        return { ...showtime, prices };
      }),
    })),
  };

  const res = await axios.post("https://buzzbook-server-dy0q.onrender.com/theater/addAudi", {
    theater_id: theaterId,
    audis: [preparedForm],
  });

  return res.data;
};
