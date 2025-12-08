// MapCenterView.jsx
"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * Component to automatically center and zoom the Leaflet map based on a bounding box.
 * This is necessary because Leaflet's map instance is only available inside MapContainer.
 * @param {Array<[number, number]>} positions - An array of [lat, lng] pairs to fit on the map.
 */
export default function MapCenterView({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions && positions.length > 0) {
      // Create a LatLngBounds object from the positions array
      const bounds = L.latLngBounds(positions);
      
      // Pad the bounds slightly and fit the map view to them
      // padding is used to prevent markers from being right on the edge
      map.fitBounds(bounds, {
        padding: [50, 50], 
        maxZoom: 16, // Don't zoom in too close
      });
    }
  }, [positions, map]);

  return null;
}