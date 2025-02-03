const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY;
const region = import.meta.env.VITE_AWS_REGION;
const style = "Standard";
const colorScheme = "Light";

export const mapStyle = `https://maps.geo.${region}.amazonaws.com/v2/styles/${style}/descriptor?key=${apiKey}&political-view=SRB&color-scheme=${colorScheme}`;
