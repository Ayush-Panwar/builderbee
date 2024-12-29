"use client";

import React from "react";
import { Button } from "../ui/button";

import UploadMediaForm from "../upload-media";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";

type Props = {
  userId: string;
};

const MediaUploadButton = ({ userId }: Props) => {
  return (
    <Dialog>
      <DialogTrigger
        disabled={userId !== "5547bc68-4be3-4e41-a040-c83fc59eace8"}
        onClick={() =>
          userId !== "5547bc68-4be3-4e41-a040-c83fc59eace8"
            ? toast.error("You are not Authroized to Upload Media")
            : ""
        }
      >
        <Button>Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-8">
        <UploadMediaForm userId={userId}></UploadMediaForm>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadButton;
