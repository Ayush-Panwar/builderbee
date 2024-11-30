import WebsiteEditor from "@/app/website/[website]/editor/[webPage]/_components/website-editor";
import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/Provider/editor-provider";
import Head from "next/head";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({
  params,
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  const pageData = domainData?.webPages.find(
    (page) => page.pathName === params.path
  );

  if (!pageData || !domainData) return notFound();

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

  return (
    <>
      <EditorProvider
        userId={domainData.userId ? domainData.userId : undefined}
        webPageDetails={pageData}
        websiteId={domainData.id}
      >
        <WebsiteEditor webPageId={pageData.id} liveMode={true} />
      </EditorProvider>
    </>
  );
};

export default Page;
