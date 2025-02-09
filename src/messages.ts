const en = {
  language: "English",
  title: "Diaspora Stands with Students",
  filter: "Find place",
  click_to_show_support: "Click to show support",
  follow_our_instagram: "Follow our Instagram profile",
  project_information: "Project information",
};

export type Messages = typeof en;

const sr: Messages = {
  language: "Srpski",
  title: "Dijaspora uz studente",
  filter: "Pronađi mesto",
  click_to_show_support: "Klikni da pokažeš podršku",
  follow_our_instagram: "Prati naš Instagram profil",
  project_information: "Informacije o projektu",
};

export const messages = {
  en,
  sr,
};

export type LanguageCode = keyof typeof messages;
