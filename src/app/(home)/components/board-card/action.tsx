"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../../../components/ui/button";
import { ConfirmModal } from "./confirm-modal";
import { useRenameModal } from "../../../../../store/use-rename-modal";
import {
  DropdownMenuContentProps,
  DropdownMenuSubContentProps,
} from "@radix-ui/react-dropdown-menu";
import { deleteWebsite } from "@/lib/queries";

import { useWebsitesData } from "../../../../../store/useWebsitesData";

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuSubContentProps["sideOffset"];
  id: string;
  name: string;
  subDomain: string;
  favicon: string;
}
export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  name,
  subDomain,
  favicon,
}: ActionProps) => {
  const { onOpen } = useRenameModal();
  const { websites, setWebsites } = useWebsitesData();

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`http://${name}.${process.env.NEXT_PUBLIC_DOMAIN}/`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const onDelete = async () => {
    const response = await deleteWebsite(id);

    if (response) {
      toast.success("Website deleted");
      const newWebsiteData = websites?.filter((website) => website.id != id);
      setWebsites(newWebsiteData);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60 z-99"
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          Copy Website link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, name, subDomain, favicon)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          header="Delete board?"
          description="This will delete the website and all of its contents."
          // disabled={pending}
          disabled={false}
          onConfirm={onDelete}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
