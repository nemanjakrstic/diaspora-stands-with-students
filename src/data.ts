import { groupBy, map, orderBy } from "lodash";
import csv from "./data.csv?raw";

const rows = csv
  .split("\n")
  .filter((line) => line.includes("http") && line.includes("instagram")) // Filter out rows without a URL
  .map((line) => {
    const [city, country, date, location, url] = line.split("\t");
    const [lat, lng] = location.split(",");
    const [day, month, year] = date ? date.split(".") : [];
    const dateIso = date ? [year, month, day].join("-") : null;

    return {
      title: [city, country].filter(Boolean).join(", "),
      city: city || undefined,
      country,
      date: date || "N/A",
      dateIso,
      location: { lng: parseFloat(lng), lat: parseFloat(lat) },
      url,
    };
  });

export interface Event {
  date: string;
  url: string;
}

export interface Location {
  title: string;
  city?: string;
  country: string;
  location: { lat: number; lng: number };
  events: Event[];
}

export const places: Location[] = map(
  groupBy(rows, (row) => row.title),
  (events) => ({
    title: events[0].title,
    city: events[0].city,
    country: events[0].country,
    location: events[0].location,
    events: orderBy(events, (event) => event.dateIso, "desc").map((event) => ({ date: event.date, url: event.url })),
  }),
);
