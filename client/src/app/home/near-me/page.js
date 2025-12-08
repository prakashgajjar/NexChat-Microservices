// NearMePage.jsx (or whatever your original file is named)
"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import MapCenterView from "./MapCenterView"; // Import the new component

// Fix Leaflet Marker Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Dummy nearby users (Unchanged)
const dummyUsers = [
  { id: "u1", userId: "1", name: "Priya Sharma", lat: 23.0225, lng: 72.5714 },
  { id: "u2", userId: "2", name: "Raj Patel", lat: 23.0349, lng: 72.5601 },
  { id: "u3", userId: "3", name: "Sagar Meena", lat: 23.0182, lng: 72.5802 },
  { id: "u4", userId: "4", name: "Harsh Solanki", lat: 23.0400, lng: 72.5600 },
];

// Distance formula (Unchanged)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1); // FIX: dLon must use lon2-lon1
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearMePage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [myLocation, setMyLocation] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [selected, setSelected] = useState(null);
  const [path, setPath] = useState(null);

  // Get real location on mount
  useEffect(() => {
    // Only request location once
    if (!myLocation) { 
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setMyLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => console.error("GPS Error:", err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }
  }, [myLocation]);

  // Filter + sort nearby users
  // Filter + sort nearby users
  const users = useMemo(() => {
    if (!myLocation) return [];

    return dummyUsers
      .map((u) => ({
        ...u,
        distance: getDistance(myLocation.lat, myLocation.lng, u.lat, u.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .filter((u) => u.distance <= radius);
  }, [myLocation, radius]);
  // Create path (polyline) and update map center logic
  const handleFindPath = (user) => {
    // Clear path if the same user is clicked
    if (selected && selected.id === user.id) {
        setSelected(null);
        setPath(null);
    } else {
        setSelected(user);
        // Path needs to be an array of [lat, lng] pairs for MapCenterView and Polyline
        setPath([
          [myLocation.lat, myLocation.lng],
          [user.lat, user.lng],
        ]);
    }
  };

  // Positions for map centering (either just myLocation, or myLocation + selected user)
  const mapPositions = useMemo(() => {
    if (!myLocation) return [];
    const base = [[myLocation.lat, myLocation.lng]];
    if (selected) {
      base.push([selected.lat, selected.lng]);
    }
    return base;
  }, [myLocation, selected]);

  // Function to format distance nicely
  const formatDistance = (distance) => {
    if (distance < 1000) {
        // Less than 1km, show meters
        return `${Math.round(distance)} meters`;
    } else {
        // 1km or more, show kilometers
        return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(distance / 1000)} km`;
    }
  }

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* LEFT SIDE (User List + Scrollable) */}
      <div 
        className={`w-full md:w-1/3 h-full flex flex-col transition-colors duration-300 ${
            theme === 'dark' ? 'border-r border-gray-700 bg-gray-900' : 'border-r border-gray-200 bg-white'
        }`}
      >

        {/* Header */}
        <div className={`p-5 shadow-sm sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <h1 className="text-2xl font-extrabold text-blue-600">📍 Near Me</h1>
        </div>

        {/* Radius Filter */}
        <div className={`p-5 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <label htmlFor="radius-select" className="block text-sm font-medium mb-1 opacity-80">
            Search Radius
          </label>
          <select
            id="radius-select"
            className={`w-full p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            {[10, 50, 100, 500, 1000, 2000, 5000, 10000].map((m) => (
              <option key={m} value={m}>
                {m < 1000 ? `${m} meters` : `${m / 1000} km`}
              </option>
            ))}
          </select>

          {myLocation && (
            <p className="text-xs opacity-60 mt-2">
              You are at: {myLocation.lat.toFixed(4)}, {myLocation.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* SCROLLABLE USER LIST */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {myLocation && users.length === 0 && <p className="text-center py-5 opacity-70">No users found within the selected radius.</p>}
          {!myLocation && <p className="text-center py-5 opacity-70">Awaiting your location...</p>}

          {users.map((u, i) => (
            <div
              key={u.id}
              className={`p-4 rounded-xl shadow-md border ${
                u.id === selected?.id 
                    ? 'border-blue-500 ring-2 ring-blue-500' 
                    : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <p className="font-semibold text-lg flex justify-between items-center">
                <span>{i + 1}. {u.name}</span>
                <span className="text-sm font-normal text-blue-500">{formatDistance(u.distance)}</span>
              </p>
              <p className="text-sm opacity-60 mt-1 mb-3">
                 {u.lat.toFixed(4)}, {u.lng.toFixed(4)}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-2">
                <button
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    u.id === selected?.id
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  onClick={() => handleFindPath(u)}
                >
                  {u.id === selected?.id ? 'Clear Path' : 'Find Path'}
                </button>

                <button
                  className={`px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200`}
                  onClick={() => router.push(`/home?id=${u.userId}`)}
                >
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (MAP FULL HEIGHT - now takes 2/3 width on md and larger screens) */}
      <div className="hidden md:block w-2/3 h-screen">
        {myLocation ? (
          <MapContainer
            // Initial center set to user's location, zoom is a decent starting point
            center={[myLocation.lat, myLocation.lng]}
            zoom={14}
            className="w-full h-full"
            // Set whenCreated to null to prevent map re-rendering on every prop change
            whenCreated={null} 
          >
            {/* Component to handle map centering/zooming */}
            <MapCenterView positions={mapPositions} />

            <TileLayer
              url={
                theme === "dark"
                  ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Your Location Marker (Blue) */}
            <Marker position={[myLocation.lat, myLocation.lng]}>
              <Popup>
                <span className="font-bold">You are here</span>
                <br />
                Lat: {myLocation.lat.toFixed(4)}, Lng: {myLocation.lng.toFixed(4)}
              </Popup>
            </Marker>

            {/* User Markers (Red/Orange) */}
            {users.map((u) => (
                <Marker 
                    key={u.id} 
                    position={[u.lat, u.lng]}
                    // Optional: Use a custom icon for selected user
                    icon={u.id === selected?.id ? L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                        shadowUrl: '/leaflet/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    }) : undefined}
                >
                    <Popup>
                        <span className="font-bold">{u.name}</span>
                        <br />
                        {formatDistance(u.distance)} away
                    </Popup>
                </Marker>
            ))}

            {/* Path Line (Red) */}
            {path && <Polyline positions={path} color="#ef4444" weight={4} dashArray="10, 10" />}
          </MapContainer>
        ) : (
          <div className="p-4 flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <p className="text-lg font-medium animate-pulse">🛰️ Getting your location...</p>
          </div>
        )}
      </div>
    </div>
  );
}