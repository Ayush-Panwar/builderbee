"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { upsertWebPage } from "@/lib/queries";
import { DeviceTypes, useEditor } from "@/Provider/editor-provider";
import { WebPage } from "@prisma/client";
import clsx from "clsx";
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FocusEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  websiteId: string;
  webPageDetails: WebPage;
  userId: string;
};

const WebsiteEditorNavigation = ({
  websiteId,
  webPageDetails,
  userId,
}: Props) => {
  const router = useRouter();
  const { state, dispatch } = useEditor();
  const [publishWebpage, setPublishWebPge] = useState<boolean>(
    webPageDetails?.published || false
  );

  useEffect(() => {
    setPublishWebPge(webPageDetails?.published);
    dispatch({
      type: "SET_WEBPAGE_ID",
      payload: { webPageId: webPageDetails?.id },
    });
  }, [webPageDetails]);

  const handlePublishChange = async (checked: boolean) => {
    const response = await upsertWebPage(
      webPageDetails.id,
      {
        ...webPageDetails,
        published: checked,
      },
      websiteId
    );
    if (response) {
      setPublishWebPge(checked);
      checked
        ? toast.success("Your Webpage is now successfully published.")
        : toast.success("Your webpage has been removed from publication.");
    } else {
      toast.error("Failed to publish your Webpage");
    }
  };

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.value === webPageDetails.name) return;
    if (event.target.value) {
      await upsertWebPage(
        webPageDetails.id,
        {
          id: webPageDetails.id,
          name: event.target.value,
        },
        websiteId
      );

      toast.success("Saved Web Page title");
      router.refresh();
    } else {
      toast.error("You need to have a title!");
      event.target.value = webPageDetails.name;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements);
    try {
      const response = await upsertWebPage(
        webPageDetails.id,
        {
          ...webPageDetails,
          content,
        },
        websiteId
      );

      toast.success("Saved Editor");
    } catch (error) {
      toast.error("Could not save editor");
    }
  };

  return (
    <TooltipProvider>
      <nav
        className={clsx(
          "border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all",
          { "!h-0 !p-0 !overflow-hidden": state.editor.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href={`/website/${websiteId}/`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full ">
            <Input
              defaultValue={webPageDetails?.name}
              className="border-none h-5 m-0 p-0 text-lg"
              onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">
              Path: /{webPageDetails?.pathName}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: value as DeviceTypes },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="">
                    <TabsTrigger
                      value="Desktop"
                      className="data-[state=active]:bg-muted w-10 h-10 p-0"
                    >
                      <Laptop />
                    </TabsTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="">
                    <TabsTrigger
                      value="Tablet"
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      <Tablet />
                    </TabsTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="">
                    <TabsTrigger
                      value="Mobile"
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      <Smartphone />
                    </TabsTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-slate-800"
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col item-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch
                checked={publishWebpage}
                onCheckedChange={handlePublishChange}
              />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Last updated {webPageDetails?.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default WebsiteEditorNavigation;
