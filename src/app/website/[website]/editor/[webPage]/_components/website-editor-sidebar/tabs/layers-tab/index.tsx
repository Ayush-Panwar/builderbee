"use client";

import { useEditor } from "@/Provider/editor-provider";
import RecursiveAccordian from "./recursive-accordian";

type Props = {};

export default function LayersTab({}: Props) {
  const { state, dispatch } = useEditor();

  return (
    <div>
      {state.editor.elements.map((element) => (
        <RecursiveAccordian element={element} key={element.id} />
      ))}
    </div>
  );
}
