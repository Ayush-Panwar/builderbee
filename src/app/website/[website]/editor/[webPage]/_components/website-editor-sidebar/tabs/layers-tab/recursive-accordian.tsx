import { EditorElement } from "@/Provider/editor-provider";
import React from "react";
import TextLayer from "./text-layer";
import ContainerLayer from "./container-layer";
import VideoLayer from "./video-layer";
import TwoColumnsLayer from "./two-columns-layer";
import LinkLayer from "./link-layer";

type Props = { element: EditorElement };

export default function RecursiveAccordian({ element }: Props) {
  switch (element.type) {
    case "text":
      return <TextLayer element={element} />;
    case "container":
      return <ContainerLayer element={element} />;
    case "video":
      return <VideoLayer element={element} />;
    case "2Col":
      return <TwoColumnsLayer element={element} />;
    case "__body":
      return <ContainerLayer element={element} />;

    case "link":
      return <LinkLayer element={element} />;
    default:
      return null;
  }
}
