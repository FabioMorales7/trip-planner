import React from "react";

const COLORS = {
  off: "#475569",
  sleeper: "#7c3aed",
  driving: "#22c55e",
  on_duty: "#f59e0b",
};

function LogsView({ data }) {
  if (!data || !data.logs) return null;

  return (
    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Driver Log</h2>
        <button className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg">
          Export PDF
        </button>
      </div>

      {data.logs.map((day, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="mb-2 text-sm text-gray-300">Day {day.day}</h3>

          <div className="border border-slate-600 rounded-lg overflow-hidden">
            
            {/* 🔹 Header horas (0–23) */}
            <div className="flex text-[10px] text-gray-400 border-b border-slate-600">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 text-center border-r border-slate-700"
                >
                  {i}
                </div>
              ))}
            </div>

            {/* 🔹 Filas */}
            {["off", "sleeper", "driving", "on_duty"].map((type) => (
              <div key={type} className="flex border-b border-slate-700">
                
                {/* Label */}
                <div className="w-28 text-xs p-2 text-gray-300 capitalize">
                  {type.replace("_", " ")}
                </div>

                {/* Timeline */}
                <div className="flex-1 relative h-6 bg-slate-900">
                  
                  {/* Grid vertical */}
                  <div className="absolute inset-0 flex">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-slate-800"
                      />
                    ))}
                  </div>

                  {/* Segments */}
                  {day.segments
                    .filter((seg) => seg.type === type)
                    .map((seg, i) => {
                      const left = (seg.start / 24) * 100;
                      const width =
                        ((seg.end - seg.start) / 24) * 100;

                      return (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: `${left}%`,
                            width: `${width}%`,
                            height: "100%",
                            backgroundColor: COLORS[type],
                            borderRadius: "2px",
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LogsView;