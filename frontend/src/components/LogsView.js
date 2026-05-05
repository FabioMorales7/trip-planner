import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ROWS = [
  { key: "off", label: "Off Duty" },
  { key: "sleeper", label: "Sleeper" },
  { key: "driving", label: "Driving" },
  { key: "on_duty", label: "On Duty" },
];

function LogsView({ logs, data }) {
  const ref = useRef();

  const exportPDF = async () => {
    const canvas = await html2canvas(ref.current);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("eld-log.pdf");
  };

  return (
    <div className="bg-[#1e293b] p-4 rounded-2xl shadow-lg border border-gray-700">

      {/* METRICS */}
      <div className="mb-4 flex justify-between text-sm text-gray-300">
        <div>Distance: {data.distance_km?.toFixed(2)} km</div>
        <div>Duration: {data.duration_hours?.toFixed(2)} hrs</div>
      </div>

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Driver Log</h2>
        <button
          onClick={exportPDF}
          className="bg-teal-500 text-black px-3 py-1 rounded"
        >
          Export PDF
        </button>
      </div>

      <div ref={ref}>
        {logs.map((log) => (
          <div key={log.day} className="mb-6">

            <p className="text-sm mb-2">Day {log.day}</p>

            <div className="border border-gray-700">

              {/* HEADER */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px repeat(24, 1fr)",
                }}
                className="text-xs border-b"
              >
                <div></div>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="text-center border-r text-gray-400">
                    {i}
                  </div>
                ))}
              </div>

              {/* ROWS */}
              {ROWS.map((row) => {
                let currentHour = 0;

                return (
                  <div
                    key={row.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px repeat(24, 1fr)",
                    }}
                    className="h-10 border-b relative"
                  >
                    <div className="text-xs pl-2 border-r flex items-center text-gray-300">
                      {row.label}
                    </div>

                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border-r border-gray-800"></div>
                    ))}

                    {log.segments.map((seg, idx) => {
                      const start = currentHour;
                      currentHour += seg.hours;

                      if (seg.type !== row.key) return null;

                      return (
                        <div
                          key={idx}
                          style={{
                            position: "absolute",
                            left: `calc(120px + ${(start / 24) * 100}%)`,
                            width: `${(seg.hours / 24) * 100}%`,
                            top: "6px",
                            height: "24px",
                            backgroundColor: "#14b8a6",
                            borderRadius: "4px",
                            boxShadow: "0 0 10px #14b8a6",
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogsView;