import { create } from "zustand";
import { locale } from "../locale";
import { useStore } from "../store";

interface LocaleStore {
  messages: ReturnType<typeof locale.get>;
  setLanguage: (language: string) => void;
}

export const useLocale = create<LocaleStore>((set) => ({
  messages: locale.get(useStore.getState().language),

  setLanguage: (language: string) => {
    useStore.setState({ language });
    set({ messages: locale.get(language) });
  },
}));
