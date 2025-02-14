import { arg, create, tpl } from "./i18n";

export const locale = create("en", {
  language: "Language",
  title: "Diaspora Stands with Students",
  filter: "Find place",
  click_to_show_support: "Click to show support",
  follow_our_instagram: "Follow our Instagram profile",
  project_information: "Project information",
  made_with_love_message: tpl`Made with love by ${arg("neca")} and ${arg("joca")}. We love you, students! We will be with you until the end!`,
  add_to_map_instructions: "To add to the map, just post on Instagram and add any of the following tags:",
  open_source_invitation: tpl`This project is open-source. Do you know how to code? Send us a PR on ${arg("GitHub")}. We can't wait for your contribution!`,
  events: "Events",
  locations: "Locations",
}).create("sr", {
  language: "Jezik",
  title: "Dijaspora uz studente",
  filter: "Pronađi mesto",
  click_to_show_support: "Klikni da pokažeš podršku",
  follow_our_instagram: "Prati naš Instagram profil",
  project_information: "Informacije o projektu",
  made_with_love_message: tpl`Napravljeno s ljubavlju od ${arg("neca")} i ${arg("joca")}. Volimo vas studenti! Borimo se sa vama do kraja!`,
  add_to_map_instructions:
    "Za dodavanje na mapu, samo objavite post na Instagramu i dodajte bilo koji od sledećih tagova:",
  open_source_invitation: tpl`Ovaj projekat je open-source. Znaš da programiraš? Pošalji nam PR na ${arg("GitHub")}-u. Jedva čekamo da nam se pridružiš!`,
  events: "Okupljanja",
  locations: "Mesta",
});
