"use client";
import { EditorElement, useEditor } from "@/Provider/editor-provider";
import { TypeIcon } from "lucide-react";
import React from "react";

type Props = { element: EditorElement };

export default function TextLayer({ element }: Props) {
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
    <div
      className="flex flex-row gap-2 items-center py-2 cursor-pointer"
      onClick={handleOnClickBody}
    >
      <TypeIcon size={15} /> Text
    </div>
  );
}
