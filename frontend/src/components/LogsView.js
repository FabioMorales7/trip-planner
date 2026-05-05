import React from "react";

const COLORS = {
  off: "#6b7280",
  sleeper: "#9333ea",
  driving: "#22c55e",
  on_duty: "#f59e0b",
};

function LogsView({ data }) {
  if (!data || !data.logs) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h2 className="font-bold mb-4">Driver Log</h2>

      {data.logs.map((day, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="mb-2 font-semibold">Day {day.day}</h3>

          {/* Timeline */}
          <div className="border rounded overflow-hidden">
            {/* Header (0–23) */}
            <div className="flex text-xs border-b">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="flex-1 text-center border-r">
                  {i}
                </div>
              ))}
            </div>

            {/* Rows */}
            {["off", "sleeper", "driving", "on_duty"].map((type) => (
              <div key={type} className="flex border-b">
                <div className="w-24 text-xs p-1 capitalize">
                  {type.replace("_", " ")}
                </div>

                <div className="flex-1 relative h-6">
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