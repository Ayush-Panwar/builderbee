import { EditorElement, useEditor } from "@/Provider/editor-provider";
import { Link2Icon } from "lucide-react";
import React from "react";

type Props = { element: EditorElement };

export default function LinkLayer({ element }: Props) {
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
    <div className="flex flex-row gap-4" onClick={handleOnClickBody}>
      <Link2Icon size={20} className="text-muted-foreground" />
      Link
    </div>
  );
}
