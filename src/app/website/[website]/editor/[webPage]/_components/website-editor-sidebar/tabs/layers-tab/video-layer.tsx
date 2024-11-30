"use-client";
import { EditorElement, useEditor } from "@/Provider/editor-provider";
import { Youtube } from "lucide-react";
import React from "react";

type Props = { element: EditorElement };

export default function VideoLayer({ element }: Props) {
  const { dispatch, state } = useEditor();

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };
  return (
    <div onClick={handleOnClickBody}>
      <Youtube size={10} className="text-muted-foreground" />
    </div>
  );
}
