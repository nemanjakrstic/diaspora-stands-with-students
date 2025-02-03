import { api } from "./api";
import { LngLatLite } from "./utils/geojson";

const USER_POSITION_KEY = "user_position";

export const getUserPosition = (): LngLatLite | null => {
  try {
    return JSON.parse(sessionStorage.getItem(USER_POSITION_KEY)!);
  } catch {
    return null;
  }
};

if (sessionStorage.getItem(USER_POSITION_KEY)) {
  console.log(USER_POSITION_KEY, JSON.parse(sessionStorage.getItem(USER_POSITION_KEY)!));
} else {
  api.ip
    .get("/")
    .then((response) => {
      const lng = parseFloat(response.data.longitude);
      const lat = parseFloat(response.data.latitude);
      sessionStorage.setItem(USER_POSITION_KEY, JSON.stringify({ lng, lat }));
    })
    .catch(() => {
      console.warn("Unable to get user position");
    });
}
