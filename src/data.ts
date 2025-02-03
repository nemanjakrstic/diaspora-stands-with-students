import { groupBy, map } from "lodash";
import csv from "./data.csv?raw";

const rows = csv
  .split("\n")
  .filter((line) => line.includes("http")) // Filter out rows without a URL
  .map((line) => {
    const [city, country, date, location, url] = line.split("\t");
    const [lat, lng] = location.split(",");

    return {
      title: [city, country].filter(Boolean).join(", "),
      city: city || undefined,
      country,
      date: date || "N/A",
      location: { lng: parseFloat(lng), lat: parseFloat(lat) },
      url,
    };
  });

export interface Event {
  date: string;
  url: string;
}

export interface Place {
  title: string;
  city?: string;
  country: string;
  location: { lat: number; lng: number };
  events: Event[];
}

export const places: Place[] = map(
  groupBy(rows, (row) => row.title),
  (events) => ({
    title: events[0].title,
    city: events[0].city,
    country: events[0].country,
    location: events[0].location,
    events: events.map((event) => ({ date: event.date, url: event.url })),
  }),
);

// export const minEvents = min(places.map((items) => items.length)) ?? 0;
// export const meanEvents = Math.ceil(mean(places.map((items) => items.length))) ?? 0;
// export const maxEvents = max(places.map((items) => items.length)) ?? 0;

// type GroupedValues = { [key: number]: number[] };

// /**
//  * Groups an array of values based on the closest match from the group values.
//  *
//  * @param values - The array of float values to be grouped.
//  * @param groups - The array of predefined group values.
//  * @returns An object where keys are group values and values are arrays of grouped numbers.
//  */
// const groupByClosest = (values: number[], groups: number[]): GroupedValues => {
//   return values.reduce((acc: GroupedValues, value: number) => {
//     const closest = minBy(groups, (group) => Math.abs(value - group))!;

//     if (!acc[closest]) {
//       acc[closest] = [];
//     }
//     acc[closest].push(value);

//     return acc;
//   }, {});
// };

// export const imageByTitle = groupByClosest(
//   places.map((items) => items.length),
//   [minEvents, meanEvents, maxEvents],
// );

// console.log(imageByTitle);
