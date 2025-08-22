"use client";

import { useState } from "react";
import { addMovieAction } from "@/actions/movieActions";

export default function AddMovieForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const form = e.currentTarget; 
        const formData = new FormData(form);

        const result = await addMovieAction(formData);

        if (result.success) {
            setMessage("✅ Movie added successfully!");
            form.reset();
        } else {
            setMessage("❌ " + result.error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Add New Movie</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" placeholder="Title" required className="w-full p-2 border rounded-md" />
                <input name="language" placeholder="Language" required className="w-full p-2 border rounded-md" />
                <input type="date" name="release_date" required className="w-full p-2 border rounded-md" />
                <input name="genre" placeholder="Genre (comma separated)" required className="w-full p-2 border rounded-md" />
                <input name="Type" placeholder="Type (e.g. 2D/3D/IMAX)" required className="w-full p-2 border rounded-md" />
                <input type="number" name="duration" placeholder="Duration (minutes)" required className="w-full p-2 border rounded-md" />
                <input type="number" name="rating" placeholder="Rating (1-10)" required className="w-full p-2 border rounded-md" />
                <input name="production_house" placeholder="Production House" required className="w-full p-2 border rounded-md" />
                <input name="director" placeholder="Director" required className="w-full p-2 border rounded-md" />
                <input name="cast" placeholder="Cast (comma separated)" required className="w-full p-2 border rounded-md" />
                <textarea name="description" placeholder="Description" required className="w-full p-2 border rounded-md" />

                
                <input type="file" name="poster_img" multiple accept="image/*" required className="w-full p-2 border rounded-md" />

                
                <input name="trailer" placeholder="Trailer links (comma separated)" className="w-full p-2 border rounded-md" />

                <select name="adult" className="w-full p-2 border rounded-md" required>
                    <option value="">Is this an Adult movie?</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Movie"}
                </button>
            </form>

            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}
