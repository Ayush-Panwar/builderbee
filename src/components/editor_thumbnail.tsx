import WebsiteEditor from "@/app/website/[website]/editor/[webPage]/_components/website-editor";
import EditorProvider from "@/Provider/editor-provider";
import { WebPage } from "@prisma/client";
import React from "react";

interface Props {
  userId: string;
  webPageDetails: WebPage;
  websiteId: string;
}

export default function EditorThumbnail({
  userId,
  webPageDetails,
  websiteId,
}: Props) {
  return (
    <EditorProvider
      userId={userId || undefined}
      webPageDetails={webPageDetails}
      websiteId={websiteId}
    >
      <WebsiteEditor webPageId={webPageDetails.id} liveMode={true} />
    </EditorProvider>
  );
}
