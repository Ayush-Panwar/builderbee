import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";

import { notFound } from "next/navigation";
import React from "react";
import EditorProvider from "@/Provider/editor-provider";
import { Website } from "@/types/editor_types";
import WebsiteEditor from "../website/[website]/editor/[webPage]/_components/website-editor";
import Head from "next/head";

const Page = async ({ params }: { params: { domain: string } }) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  if (!domainData) return notFound();

  const pageData = domainData.webPages.find((page) => !page.pathName);

  if (!pageData) return notFound();

  if (!domainData.published) return notFound();

  if (!pageData.published) return notFound();

  await db.webPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
  // document.title = domainData.name;
  // const link: HTMLLinkElement | null =
  //   document.querySelector("link[rel~='icon']");
  // if (link) {
  //   link.href = domainData.favicon || "";
  // } else {
  //   const newLink = document.createElement("link");
  //   newLink.rel = "icon";
  //   newLink.href = domainData.favicon || "";
  //   document.head.appendChild(newLink);
  // }

  return (
    <>
      <EditorProvider
        userId={domainData.userId ? domainData.userId : undefined}
        webPageDetails={pageData}
        websiteId={domainData.id}
      >
        <WebsiteEditor
          webPageId={pageData.id}
          liveMode={true}
          title={domainData.name}
          favicon={domainData.favicon || ""}
        />
      </EditorProvider>
    </>
  );
};

export default Page;
