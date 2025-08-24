"use client";

import { useState } from "react";
import { addMovieAction } from "@/actions/movieActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function AddMovieForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        const result = await addMovieAction(formData);

        if (result.success) {
            toast.success("✅ Movie added successfully!");
            form.reset();
        } else {
            toast.error("❌ " + result.error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pt-4 rounded-2xl shadow-md">
            <div className="flex justify-center">
                <h2 className="text-3xl font-semibold mb-10 text-purple-600">
                    Add New Movie
                </h2>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-8 text-white"
            >
                <input
                    name="title"
                    placeholder="Title"
                    required
                    minLength={2}
                    maxLength={60}
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    name="language"
                    placeholder="Language (comma separated)"
                    required
                    pattern="^[A-Za-z\s]+$"
                    title="Only letters are allowed"
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    type="date"
                    name="release_date"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    name="genre"
                    placeholder="Genre (comma separated)"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />
                <select
                    name="Type"
                    className="p-2 border rounded-md border-purple-600"
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Bollywood" className="text-black">Bollywood</option>
                    <option value="Hollywood" className="text-black">Hollywood</option>
                    <option value="Tollywood" className="text-black">Tollywood</option>
                </select>
                <input
                    type="number"
                    name="duration"
                    placeholder="Duration (minutes)"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    type="number"
                    name="rating"
                    placeholder="Rating (1-10)"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    name="production_house"
                    placeholder="Production House"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    name="director"
                    placeholder="Director"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />
                <input
                    name="cast"
                    placeholder="Cast (comma separated)"
                    required
                    className="p-2 border rounded-md border-purple-600"
                />

                {/* Full width items */}
                <textarea
                    name="description"
                    placeholder="Description"
                    required
                    className="col-span-2 p-2 border rounded-md border-purple-600 resize-none"
                />

                <input
                    type="file"
                    name="poster_img"
                    multiple
                    accept="image/*"
                    required
                    className="col-span-2 p-2 border rounded-md border-purple-600"
                />

                <input
                    name="trailer"
                    placeholder="Trailer links (comma separated)"
                    className="col-span-2 p-2 border rounded-md border-purple-600"
                />

                <select
                    name="adult"
                    className="col-span-2 p-2 border rounded-md border-purple-600"
                    required
                >
                    <option value="" className="text-black">Is this an Adult movie?</option>
                    <option value="true" className="text-black">Yes</option>
                    <option value="false" className="text-black">No</option>
                </select>

                <div className="col-span-2 flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()} // ✅ navigate back
                        className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Movie"}
                    </button>
                </div>
            </form>

        </div>
    );
}
