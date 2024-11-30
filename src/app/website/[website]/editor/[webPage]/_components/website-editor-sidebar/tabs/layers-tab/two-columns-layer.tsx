import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorElement, useEditor } from "@/Provider/editor-provider";
import React from "react";
import RecursiveAccordian from "./recursive-accordian";

type Props = { element: EditorElement };

export default function TwoColumnsLayer({ element }: Props) {
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
    <Accordion type="multiple">
      <AccordionItem value="item-1" className=" py-0 border-y-[1px]">
        <AccordionTrigger
          className="!no-underline  data-[state=open]:bg-muted"
          onClick={handleOnClickBody}
        >
          <div className="py-2 flex flex-row items-center gap-2">
            <div className="h-4 w-8 flex flex-row gap-[4px]">
              <div className="border-dashed border-[1px] h-4 w-4 rounded-sm bg-muted border-muted-foreground/50"></div>
              <div className="border-dashed border-[1px] h-4 w-4 rounded-sm bg-muted border-muted-foreground/50 "></div>
            </div>
            Two-Container
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {Array.isArray(element.content) &&
            element.content.map((childElement) => (
              <RecursiveAccordian
                element={childElement}
                key={childElement.id}
              />
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
