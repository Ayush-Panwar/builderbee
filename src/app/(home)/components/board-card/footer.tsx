import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Star } from "lucide-react";
import React from "react";

interface FooterProps {
  title: string;
  published: boolean;

  updatedAtLabel: string;
}

export default function Footer({
  title,
  published,
  updatedAtLabel,
}: FooterProps) {
  return (
    <div className="relative bg-background p-3">
      <p className="text-[16px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px]  text-muted-foreground truncate">
        {updatedAtLabel}
      </p>
      <div
        className={clsx(
          "rounded-full h-3 w-3 absolute top-4 right-3 bg-red-700",
          {
            "!bg-green-500": published,
          }
        )}
      ></div>
    </div>
  );
}
