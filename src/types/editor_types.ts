import { getMedia } from "@/lib/queries";
import { Prisma } from "@prisma/client";

export type EditorBtns =
  | "text"
  | "container"
  | "section"
  | "paymentForm"
  | "link"
  | "2Col"
  | "video"
  | "__body"
  | "image"
  | null
  | "3Col";

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
};

export type UpsertWebPage = Prisma.WebPageCreateWithoutWebsiteInput;

export type UpsertWebsite = Prisma.WebsiteUncheckedUpdateInput;

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutUserInput;

export type Website = Prisma.WebsiteGetPayload<{
  include: { webPages: true };
}>;
