import { create } from "zustand";

interface IMetaData {
  title: string;
  favicon: string;
  setTitle: (newTitle: string) => void;
  setFavicon: (newFavicon: string) => void;
}

export const useMetadataStore = create<IMetaData>((set) => ({
  title: "BuilderBee",
  favicon: "/favicon.ico",
  setTitle: (newTitle) => set({ title: newTitle }),
  setFavicon: (newFavicon) => set({ favicon: newFavicon }),
}));
