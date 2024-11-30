import { NextApiRequest, NextApiResponse } from "next";

// import { renderToString } from "react-dom/server";
import EditorThumbnail from "@/components/editor_thumbnail";
import { WebPage } from "@prisma/client";

interface Props {
  userId: string;
  webPageDetails: WebPage;
  websiteId: string;
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse input from the request body or query
    const { userId, webPageDetails, websiteId } = req.body as Props;
    console.log("😎😎😎", userId, webPageDetails, websiteId, req.body);
    const { renderToString } = await import("react-dom/server");

    // Render the React component as a string

    const html = renderToString(
      <EditorThumbnail
        userId={userId}
        webPageDetails={webPageDetails}
        websiteId={websiteId}
      />
    );

    // Launch a headless browser using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(html, {
      waitUntil: "networkidle0", // Wait for network to be idle
    });

    // Take a screenshot of the content
    const screenshot = await page.screenshot({ type: "png" });

    // Close the browser
    await browser.close();

    // Set the response headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", screenshot.length.toString());

    // Send the image as the response
    res.end(screenshot);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("Error generating image");
  }
}
