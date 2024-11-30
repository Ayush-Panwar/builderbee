"use client";

import React from "react";
import { Button } from "../ui/button";

import UploadMediaForm from "../upload-media";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type Props = {
  userId: string;
};

const MediaUploadButton = ({ userId }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-8">
        <UploadMediaForm userId={userId}></UploadMediaForm>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadButton;
