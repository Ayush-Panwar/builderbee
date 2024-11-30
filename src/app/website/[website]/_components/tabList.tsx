import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideDelete, PencilIcon, SettingsIcon } from "lucide-react";

type Props = {};

const TabList = (props: Props) => {
  return (
    <TabsList className=" flex items-center flex-col justify-evenly w-20 bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Editor"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <PencilIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Settings"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <SettingsIcon />
      </TabsTrigger>

      <TabsTrigger
        value="Delete"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <LucideDelete />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
