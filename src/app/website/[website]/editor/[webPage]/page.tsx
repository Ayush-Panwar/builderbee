"use client";

import { getWebPageDetail } from "@/lib/queries";
import EditorProvider from "@/Provider/editor-provider";
import { WebPage } from "@prisma/client";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WebsiteEditorNavigation from "./_components/website-editor-navigation";
import WebsiteEditorSidebar from "./_components/website-editor-sidebar";
import WebsiteEditor from "./_components/website-editor";

type Props = {
  params: {
    website: string;
    webPage: string;
  };
};

export default function EditorPage({ params }: Props) {
  const router = useRouter();
  const { data: session, data } = useSession();
  const [webPageDetails, setWebPageDetails] = useState<WebPage>();

  useEffect(() => {
    const getwebPageDetails = async () => {
      const response = await getWebPageDetail(params.webPage);
      if (!response) {
        return router.push(`/${params.website}`);
      }
      setWebPageDetails(response);
    };
    getwebPageDetails();
  }, [params]);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        userId={session?.user.id}
        websiteId={params.website}
        webPageDetails={webPageDetails as WebPage}
      >
        <WebsiteEditorNavigation
          websiteId={params.website}
          webPageDetails={webPageDetails as WebPage}
          userId={session?.user.id}
        />
        <div className="h-full flex justify-center">
          <WebsiteEditor webPageId={params.webPage} />
        </div>

        <WebsiteEditorSidebar userId={session?.user.id} />
      </EditorProvider>
    </div>
  );
}
