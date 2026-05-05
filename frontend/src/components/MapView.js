import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40] });
    }
  }, [positions]);

  return null;
}

function MapView({ route }) {
  if (!route) return null;

  const positions = route.coordinates.map((c) => [c[1], c[0]]);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
      <MapContainer center={positions[0]} zoom={6} style={{ height: "400px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={positions} color="#14b8a6" />
        <FitBounds positions={positions} />
      </MapContainer>
    </div>
  );
}

export default MapView;