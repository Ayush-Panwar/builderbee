"use server";
import { UTApi } from "uploadthing/server";
import { db } from "./db";
import { v4 } from "uuid";
import { CreateMediaType, UpsertWebPage } from "@/types/editor_types";

const images = [
  "/placeholder/1.svg",
  "/placeholder/2.svg",
  "/placeholder/3.svg",
  "/placeholder/4.svg",
  "/placeholder/5.svg",
  "/placeholder/6.svg",
  "/placeholder/7.svg",
  "/placeholder/8.svg",
  "/placeholder/9.svg",
  "/placeholder/10.svg",
];

const randomImage = images[Math.floor(Math.random() * images.length)];

export const checkSubDomain = async (subDomain: string) => {
  const checked_subDomain = await db.website.findUnique({
    where: {
      subDomain,
    },
  });
  return checked_subDomain;
};
export const checkPathName = async (websiteId: string, pathName: string) => {
  const checked_pathName = await db.website.findUnique({
    where: {
      id: websiteId,
      webPages: {
        some: { pathName },
      },
    },
  });

  return checked_pathName;
};
export const createWebsite = async (
  websiteId: string,
  website: {
    name: string;
    subDomain: string;
    favicon?: string;
    // userId?: string;
  },

  userId?: string
) => {
  const response = await db.website.create({
    data: {
      ...website, //can also include userId in values or website
      id: websiteId || v4(),
      imageUrl: website.favicon || randomImage,
      userId: userId,
    },
  });
  return response;
};

export const updateWebsiteDetails = async (
  websiteId: string,
  website: {
    name: string;
    subDomain: string;
    favicon?: string;
    // userId?: string;
  }
) => {
  const response = await db.website.update({
    where: {
      id: websiteId,
    },
    data: {
      ...website, //can also include userId in values or website
      imageUrl: website.favicon || randomImage,
    },
  });
  return response;
};

export const deleteWebsite = async (websiteId: string) => {
  const response = await db.website.delete({
    where: {
      id: websiteId,
    },
  });
  return response;
};

export const publishWebsite = async (websiteId: string, publish: boolean) => {
  const response = await db.website.update({
    where: { id: websiteId },
    data: {
      published: publish,
    },
  });
  return response;
};

export const upsertWebPage = async (
  webPageId: string,
  webPage: UpsertWebPage,
  websiteId: string
) => {
  const response = await db.webPage.upsert({
    where: { id: webPageId },
    update: webPage,
    create: {
      ...webPage,
      id: webPageId || v4(),
      websiteId,
    },
  });
  return response;
};
export const removeImage = async (value: string) => {
  await new UTApi().deleteFiles(value.split("/f/").pop() as string);
};

export const getWebsiteDetails = async (id: string) => {
  const response = await db.website.findUnique({
    where: {
      id,
    },
    include: {
      webPages: true,
    },
  });
  return response;
};

export const getUserDetails = async (id: string) => {
  const response = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      websites: true,
    },
  });
  return response;
};

export const getWebPageDetail = async (id: string) => {
  const response = await db.webPage.findUnique({
    where: {
      id: id,
    },
  });
  return response;
};

export const deleteWebPage = async (id: string) => {
  const response = await db.webPage.delete({
    where: {
      id: id,
    },
  });
  return response;
};

export const getMedia = async (userId: string) => {
  const mediafiles = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: { Media: true },
  });
  return mediafiles;
};

export const createMedia = async (
  userId: string,
  mediaFile: CreateMediaType
) => {
  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      userId: userId,
    },
  });

  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });
  return response;
};

export const getDomainContent = async (subDomain: string) => {
  const response = await db.website.findUnique({
    where: {
      subDomain,
    },
    include: { webPages: true },
  });
  return response;
};
