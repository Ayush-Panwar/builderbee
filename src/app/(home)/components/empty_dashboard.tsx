import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import DialogForm from "./dialog-form";
import { Button } from "@/components/ui/button";

type Props = {};

export default function EmptyDashboard({}: Props) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center translate-y-[30%] ">
      <Image src="/elements.svg" alt="Empty" height={300} width={300} />
      <h2 className="text-2xl font-semibold mt-6 ">Welcome to BuilderBee</h2>
      <p className="text-muted-foreground tetx-sm mt-2">
        Create an organistaion to get started
      </p>
      <div className="mt-6">
        <DialogForm>
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Build Your Website
          </div>
        </DialogForm>
      </div>
    </div>
  );
}
