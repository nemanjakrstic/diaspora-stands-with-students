import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LanguageCode, Messages, messages } from "./messages";

interface Store {
  count: number;
  showInfoModal: boolean;
  messages: Messages;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

export const useStore = create(
  persist<Store>(
    (set) => ({
      count: 0,
      showInfoModal: true,
      messages: messages.sr,
      language: "sr",

      setLanguage(language: LanguageCode) {
        set({
          language,
          messages: messages[language],
        });
      },
    }),
    {
      name: "diaspora_stands_with_students",
    },
  ),
);
