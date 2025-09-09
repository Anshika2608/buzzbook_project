"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAudi } from "@/actions/theaterActions";
import { toast } from "sonner";

const layoutConfig: Record<string, string[]> = {
  standard: ["VIP", "Premium", "Regular"],
  luxury: ["Sofa", "Regular"],
  studio: ["Regular"],
  recliner: ["Recliner", "Regular"],
  balcony: ["Premium", "Regular"],
};
type Showtime = {
  time: string;
  prices: Record<string, number>;
};

type Film = {
  title: string;
  language: string;
  showtimes: Showtime[];
};

type AudiForm = {
  audi_number: string;
  layout_type: string;
  rows: number;
  seatsPerRow: number;
  vipRows: number;
  premiumRows: number;
  sofaRows: number;
  regularRows: number;
  reclinerRows: number;
  emptySpaces: string[];
  films_showing: Film[];
};

export default function AddAudiForm({
  theaterId,
  onClose,
}: {
  theaterId: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<AudiForm>({
    audi_number: "",
    layout_type: "",
    rows: 0,
    seatsPerRow: 0,
    vipRows: 0,
    premiumRows: 0,
    sofaRows: 0,
    regularRows: 0,
    reclinerRows: 0,
    emptySpaces: [] as string[],
    films_showing: [
      {
        title: "",
        language: "",
        showtimes: [
          {
            time: "",
            prices: {} as Record<string, number>,
          },
        ],
      },
    ],
  });

  const activeSeatTypes = layoutConfig[form.layout_type.toLowerCase()] || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    path?: (string | number)[]
  ) => {
    const { name, value } = e.target;

    if (path && path.length) {
      setForm((prev) => {
        const copy = { ...prev };
        let obj: any = copy;
        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          if (!(key in obj)) obj[key] = typeof path[i + 1] === "number" ? [] : {};
          obj = obj[key];
        }
        const lastKey = path[path.length - 1];
        if (!(lastKey in obj)) obj[lastKey] = {};
        obj[lastKey][name] = isNaN(Number(value)) ? value : Number(value);
        return copy;
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: isNaN(Number(value)) ? value : Number(value),
      }));
    }
  };

  // ➕ Add film
  const addFilm = () => {
    setForm((prev) => ({
      ...prev,
      films_showing: [
        ...prev.films_showing,
        { title: "", language: "", showtimes: [{ time: "", prices: {} }] },
      ],
    }));
  };

  // ❌ Remove film
const removeFilm = (filmIndex: number) => {
  setForm((prev) => {
    const copy = { ...prev };
    copy.films_showing = prev.films_showing.filter(
      (_: any, idx: number) => idx !== filmIndex
    );
    return copy;
  });
};


const addShowtime = (filmIndex: number) => {
  setForm((prev) => {
    const copy = { ...prev };
    copy.films_showing = [...prev.films_showing]; 
    copy.films_showing[filmIndex] = {
      ...prev.films_showing[filmIndex],
      showtimes: [
        ...prev.films_showing[filmIndex].showtimes, 
        { time: "", prices: {} }, 
      ],
    };
    return copy;
  });
};


const removeShowtime = (filmIndex: number, showIndex: number) => {
  setForm((prev) => {
    const copy = { ...prev };
    copy.films_showing = [...prev.films_showing];
    copy.films_showing[filmIndex] = {
      ...prev.films_showing[filmIndex],
      showtimes: prev.films_showing[filmIndex].showtimes.filter(
        (_: any, idx: number) => idx !== showIndex
      ),
    };
    return copy;
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAudi(theaterId, form);
      toast.success("Audi added successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add audi");
    }
  };

  const activeFields =
    layoutConfig[form.layout_type.toLowerCase()]?.map(
      (type) => `${type.toLowerCase()}Rows`
    ) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto pt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white p-8 shadow-lg w-full max-w-5xl mx-auto space-y-6"
      >
        <h2 className="text-2xl font-bold text-purple-400">Add Audi</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="audi_number">Audi Number</Label>
            <Input
              id="audi_number"
              type="text"
              name="audi_number"
              placeholder="Audi Number"
              value={form.audi_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="layout_type">Layout Type</Label>
            <select
              id="layout_type"
              name="layout_type"
              value={form.layout_type}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
              required
            >
              <option value="">Select Layout Type</option>
              {Object.keys(layoutConfig).map((layout) => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rows + Seats per row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="rows">Total Rows</Label>
            <Input
              id="rows"
              type="number"
              name="rows"
              placeholder="Total Rows"
              value={form.rows}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatsPerRow">Seats per Row</Label>
            <Input
              id="seatsPerRow"
              type="number"
              name="seatsPerRow"
              placeholder="Seats per Row"
              value={form.seatsPerRow}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Dynamic row fields */}
        {activeFields.map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{field.replace("Rows", "")} Rows</Label>
            <Input
              id={field}
              type="number"
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Films Section */}
        <h3 className="text-xl font-semibold text-purple-300">Films Showing</h3>

        {form.films_showing.map((film, filmIndex) => (
          <div
            key={filmIndex}
            className="border border-gray-700 p-4 rounded space-y-4 relative"
          >
            {/* ❌ Remove Film */}
            <button
              type="button"
              onClick={() => removeFilm(filmIndex)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-400"
            >
              ✖
            </button>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Film Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Film Title"
                  value={film.title}
                  onChange={(e) =>
                    handleChange(e, ["films_showing", filmIndex])
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Input
                  type="text"
                  name="language"
                  placeholder="Language"
                  value={film.language}
                  onChange={(e) =>
                    handleChange(e, ["films_showing", filmIndex])
                  }
                  required
                />
              </div>
            </div>

            <h4 className="font-semibold text-purple-200">Showtimes</h4>
            {film.showtimes.map((showtime, showIndex) => (
              <div
                key={showIndex}
                className="space-y-4 border-l-2 border-purple-600 pl-4 relative"
              >
                
                <button
                  type="button"
                  onClick={() => removeShowtime(filmIndex, showIndex)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                >
                  ✖
                </button>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="text"
                    name="time"
                    placeholder="HH:MM"
                    value={showtime.time}
                    onChange={(e) =>
                      handleChange(e, [
                        "films_showing",
                        filmIndex,
                        "showtimes",
                        showIndex,
                      ])
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeSeatTypes.map((type) => (
                    <div key={type} className="space-y-2">
                      <Label>{type} Price</Label>
                      <Input
                        type="number"
                        value={showtime.prices[type] || 0}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setForm((prev: any) => {
                            const copy = { ...prev };
                            copy.films_showing[filmIndex].showtimes[
                              showIndex
                            ].prices[type] = value;
                            return copy;
                          });
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addShowtime(filmIndex)}
              className="px-4 py-2 mt-2 bg-purple-600 rounded hover:bg-purple-500"
            >
              ➕ Add Showtime
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFilm}
          className="px-4 py-2 bg-purple-700 rounded hover:bg-purple-600"
        >
          ➕ Add Another Film
        </button>

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded bg-purple-600 hover:bg-purple-500"
          >
            Add Audi
          </button>
        </div>
      </form>
    </div>
  );
}
