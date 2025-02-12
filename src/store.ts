import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  count: number;
  language: string;
  showInfoModal: boolean;
}

export const useStore = create(
  persist<Store>(
    () => ({
      count: 0,
      showInfoModal: true,
      language: "sr",
    }),
    {
      name: "diaspora_stands_with_students",
    },
  ),
);
