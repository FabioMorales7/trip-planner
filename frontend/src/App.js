import React, { useState } from "react";
import TripForm from "./components/TripForm";
import MapView from "./components/MapView";
import LogsView from "./components/LogsView";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6">
        Trip <span className="text-teal-400">Automation</span>
      </h1>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mb-4 text-teal-400 animate-pulse">
          Calculating route...
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">

        <TripForm
          setData={setData}
          setError={setError}
          setLoading={setLoading}
        />

        {data && <MapView route={data.route} />}

        {data && <LogsView logs={data.logs} data={data} />}
        <div className="text-xs text-gray-400 mt-4 text-center">
          Built by Fabio Morales
        </div>
      </div>
    </div>
  );
}

export default App;