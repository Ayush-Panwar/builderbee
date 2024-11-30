"use client";

import { z } from "zod";

import Navbar from "@/components/navbar/page";

import { Pencil, Plus } from "lucide-react";
import { getSession, SessionProvider, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { Website } from "@prisma/client";

import EmptyDashboard from "./components/empty_dashboard";
import DialogForm from "./components/dialog-form";
import { WebsiteCard } from "./components/board-card";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useWebsitesData } from "../../../store/useWebsitesData";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "website must be at least 5 characters.",
  }),
  subDomain: z
    .string()
    .min(2, {
      message: "Subdomain must be at least 3 characters.",
    })
    .max(15, {
      message: "Subdomain can be max 15 characters.",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Subdomain must not contain non-spacing characters",
    }),
  favicon: z.string().optional(),
});
export default function Home() {
  const { data: session, status } = useSession();

  const { websites, setWebsites } = useWebsitesData();

  const router = useRouter();

  if (session) {
    console.log(session);
  }
  useEffect(() => {
    setWebsites(session?.user?.websites);
  }, [session?.user]);

  return (
    <>
      <Navbar />
      <div className="h-[85vh] w-full p-6">
        <div className="flex flex-row gap-4">
          {websites &&
            websites?.length > 0 &&
            websites.map((website: Website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}

          {websites && websites.length > 0 ? (
            <DialogForm>
              <div className="flex flex-col gap-2 ">
                <Card className="group w-56 h-56 shadow hover:shadow-lg bg-white flex items-center justify-center hover:fill-sky-500">
                  <Plus
                    size={75}
                    stroke="grey"
                    className="group-hover:stroke-sky-300 "
                  />
                </Card>
              </div>
            </DialogForm>
          ) : (
            <EmptyDashboard />
          )}
        </div>
      </div>
    </>
  );
}
