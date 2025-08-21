"use server";

import axios from "axios";

export async function addMovieAction(formData: FormData) {
  try {
    const res = await axios.post("https://buzzbook-server-dy0q.onrender.com/movie/add_movie", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("Add movie error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || "Something went wrong" };
  }
}
