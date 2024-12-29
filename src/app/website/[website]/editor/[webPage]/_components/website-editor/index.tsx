"use client";
import { Button } from "@/components/ui/button";

import clsx from "clsx";
import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./website-editor-components/recursive";
import { useEditor } from "@/Provider/editor-provider";
import { getWebPageDetail } from "@/lib/queries";

type Props = {
  webPageId: string;
  liveMode?: boolean;
  title?: string;
  favicon?: string;
};

const WebsiteEditor = ({ webPageId, liveMode, title, favicon }: Props) => {
  const { dispatch, state } = useEditor();
  document.title = title || "BuilderBee";
  const link: HTMLLinkElement | null =
    document.querySelector("link[rel~='icon']");
  if (link) {
    link.href = favicon || "";
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = favicon || "";
    document.head.appendChild(newLink);
  }

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  //CHALLENGE: make this more performant
  useEffect(() => {
    const fetchData = async () => {
      const response = await getWebPageDetail(webPageId);
      if (!response) return;

      dispatch({
        type: "LOAD_DATA",
        payload: {
          elements: response.content ? JSON.parse(response?.content) : "",
          withLive: !!liveMode,
        },
      });
    };
    fetchData();
  }, [webPageId]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handleUnpreview = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  return (
    <div
      className={clsx(
        "use-automation-zoom-in h-[100vh] mr-[385px] bg-background transition-all rounded-md overflow-auto",
        {
          "!p-0 !mr-0":
            state.editor.previewMode === true || state.editor.liveMode === true,
          "!w-[850px]": state.editor.device === "Tablet",
          "!w-[420px]": state.editor.device === "Mobile",
          "w-full": state.editor.device === "Desktop",
        }
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );
};

export default WebsiteEditor;
