import { Website } from "@prisma/client";
import { create } from "zustand";

interface IWebsiteData {
  websites: Website[];

  setWebsites: (websitesData: Website[]) => void;
}

export const useWebsitesData = create<IWebsiteData>()((set) => ({
  websites: [],
  setWebsites: (websiteData) => set((state) => ({ websites: websiteData })),
}));
