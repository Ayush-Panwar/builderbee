"use client";

import Image from "next/image";
import Link from "next/link";
import Overlay from "./overlay";

import { formatDistance, formatDistanceToNow } from "date-fns";
import Footer from "./footer";

import { MoreHorizontal } from "lucide-react";

import { toast } from "sonner";
import { Website } from "@prisma/client";
import { Actions } from "./action";
import { Dispatch, SetStateAction } from "react";

interface BoardCardsProps {
  website: Website;
}

export const WebsiteCard = ({ website }: BoardCardsProps) => {
  const updatedAtLabel = formatDistanceToNow(website.updatedAt, {
    addSuffix: true,
  });

  return (
    <Link href={`/website/${website.id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden w-[12vw]">
        <div className="relative flex-1 bg-amber-50">
          <Image
            src={website.imageUrl}
            alt="Doodle"
            fill
            className="object-fit"
          />
          <Overlay />
          <Actions
            id={website.id}
            name={website.name}
            subDomain={website.subDomain || ""}
            favicon={website.favicon || ""}
            side="right"
          >
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          title={website.name}
          updatedAtLabel={updatedAtLabel}
          published={website.published}
        />
      </div>
    </Link>
  );
};
