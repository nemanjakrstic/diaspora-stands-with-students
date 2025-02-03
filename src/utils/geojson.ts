import { lineString } from "@turf/helpers";
import { bezierSpline } from "@turf/turf";
import { LngLat } from "maplibre-gl";

export type LngLatLite = Pick<LngLat, "lng" | "lat">;

export const createArc = (start: LngLatLite, end: LngLatLite) => {
  const CURVATURE_FACTOR = 0.1; // Adjust for more or less curvature

  const midPoint: LngLatLite = {
    lng: (start.lng + end.lng) / 2,
    lat: (start.lat + end.lat) / 2,
  };

  // Calculate control point for curvature
  const controlPoint: LngLatLite = {
    lng: midPoint.lng,
    lat: midPoint.lat + CURVATURE_FACTOR * Math.hypot(end.lng - start.lng, end.lat - start.lat),
  };

  // Create a simple curved path using Bezier spline
  const arc = bezierSpline(
    lineString([
      [start.lng, start.lat],
      [controlPoint.lng, controlPoint.lat],
      [end.lng, end.lat],
    ]),
  );

  return arc;
};
