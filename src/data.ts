import { groupBy, map, mapValues, orderBy } from "lodash";
import csv from "./data.csv?raw";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";

dayjs.extend(isoWeek);

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
      dateIso: dateIso || "N/A",
      location: { lng: parseFloat(lng), lat: parseFloat(lat) },
      url,
    };
  });

export interface LocationEvent {
  date: string;
  dateIso: string;
  url: string;
}

export interface Location {
  title: string;
  city?: string;
  country: string;
  location: { lat: number; lng: number };
  events: LocationEvent[];
}

export const locations: Location[] = map(
  groupBy(rows, (row) => row.title),
  (events) => ({
    title: events[0].title,
    city: events[0].city,
    country: events[0].country,
    location: events[0].location,
    events: orderBy(events, (event) => event.dateIso, "desc").map((event) => ({
      date: event.date,
      dateIso: event.dateIso,
      url: event.url,
    })),
  }),
);

interface Event {
  location: Location;
  event: LocationEvent;
}

export const events = locations.reduce<Event[]>((locations, location) => {
  locations.push(...location.events.map((event) => ({ location, event })));
  return locations;
}, []);

export const eventCountByDate = mapValues(
  groupBy(rows, (row) => row.dateIso),
  (rows) => rows.length,
);

export const eventCountByWeek = Object.entries(
  mapValues(
    groupBy(rows, (row) => {
      const date = dayjs(row.dateIso);
      const week = date.isoWeek().toString().padStart(2, "0");
      return `${date.isoWeekYear()}-W${week}`;
    }),
    (rows) => rows.length,
  ),
);
