import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorElement, useEditor } from "@/Provider/editor-provider";
import React from "react";
import RecursiveAccordian from "./recursive-accordian";
import clsx from "clsx";

type Props = { element: EditorElement };

export default function ContainerLayer({ element }: Props) {
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
      <AccordionItem
        value="item-1"
        className={clsx("py-0 border-y-[1px]", {
          "px-6": element.name === "Body",
          "pl-2": element.name === "Container",
        })}
      >
        <AccordionTrigger
          className="!no-underline data-[state=open]:bg-muted w-full"
          onClick={handleOnClickBody}
        >
          <div className=" flex flex-row items-center gap-2 ">
            <div className=" border-dashed border-[1px] h-4 w-4 rounded-sm bg-muted border-muted-foreground/50 " />
            {element.name}
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
