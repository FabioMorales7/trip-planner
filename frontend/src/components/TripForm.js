import React, { useState } from "react";
import axios from "axios";

function TripForm({ setData, setError, setLoading }) {
  const [form, setForm] = useState({
    current_location: "",
    pickup: "",
    dropoff: "",
    cycle_used: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const res = await axios.post(
        `${API_URL}/api/plan-trip/`,
        form
      );

      setData(res.data);

    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Unable to calculate route. Try different locations.";

      setError(msg);
      setData(null);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-gray-700 space-y-4"
    >
      <h2 className="text-lg font-semibold">Trip Planner</h2>

      {[
        { key: "current_location", label: "Current Location", placeholder: "Current Location" },
        { key: "pickup", label: "Pickup Location", placeholder: "Pickup Location" },
        { key: "dropoff", label: "Dropoff Location", placeholder: "Dropoff Location" },
      ].map((field) => (
        <div key={field.key}>
          <label className="text-sm text-gray-300">{field.label}</label>
          <input
            required
            className="w-full mt-1 p-2 rounded bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400"
            placeholder={field.placeholder}
            onChange={(e) =>
              setForm({ ...form, [field.key]: e.target.value })
            }
          />
        </div>
      ))}

      <div>
        <label className="text-sm text-gray-300">
          Cycle Used (Hours)
        </label>
        <input
          type="number"
          required
          className="w-full mt-1 p-2 rounded bg-[#0f172a] border border-gray-600 text-white"
          onChange={(e) =>
            setForm({ ...form, cycle_used: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold p-2 rounded w-full hover:opacity-90 transition disabled:opacity-50"
      >
        Plan Trip
      </button>
    </form>
  );
}

export default TripForm;