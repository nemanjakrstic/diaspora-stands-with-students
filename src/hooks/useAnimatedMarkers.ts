import { MapInstance } from "@vis.gl/react-maplibre";
import { Marker } from "maplibre-gl";
import { useCallback, useRef, useState } from "react";
import { createArc, LngLatLite } from "../utils/geojson";
import { useAnimationFrame } from "./useAnimationFrame";
import heart from "../images/heart.svg";

const createImage = () => {
  const img = document.createElement("img");
  img.src = heart;
  img.style.color = "purple";
  img.style.fill = "purple";
  img.style.width = "30px";
  img.style.height = "30px";
  return img;
};

const VELOCITY = 10;

interface AnimatedMarker {
  marker: Marker;
  coordinates: number[][];
  currentIndex: number;
}

export const useAnimatedMarkers = () => {
  const markersRef = useRef<AnimatedMarker[]>([]);
  const [animate, setAnimate] = useState(markersRef.current.length > 0);

  useAnimationFrame(animate, () => {
    const nextMarkers: AnimatedMarker[] = [];

    for (const marker of markersRef.current) {
      marker.currentIndex += VELOCITY;

      if (marker.currentIndex < marker.coordinates.length) {
        const [lng, lat] = marker.coordinates[marker.currentIndex];
        marker.marker.setLngLat([lng, lat]);
        nextMarkers.push(marker);
      } else {
        marker.marker.remove();
      }
    }

    markersRef.current = nextMarkers;

    // Consider calling a debounced version
    // since it will still update the state at a great frequency
    setAnimate(nextMarkers.length > 0);
  });

  return useCallback((map: MapInstance, left: LngLatLite, right: LngLatLite) => {
    const { coordinates } = createArc(left, right).geometry;
    const [lng, lat] = coordinates[0];

    const marker = new Marker({ element: createImage() });
    marker.setLngLat([lng, lat]);
    marker.addTo(map);

    markersRef.current.push({ marker, coordinates, currentIndex: 0 });
    setAnimate(true);
  }, []);
};
