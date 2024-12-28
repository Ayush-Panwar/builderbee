import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Example logic: log the request URL
  console.log(`Request URL: ${request.url}`);

  const url = request.nextUrl;
  const searchParams = url.searchParams.toString();
  let hostname = request.headers;

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  const customSubDomain = hostname
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];
  console.log(
    "😁😀",
    hostname.get("host"),
    process.env.NEXT_PUBLIC_DOMAIN,
    hostname.get("host")?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`),
    hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0]
  );

  if (customSubDomain) {
    console.log(
      "😎",
      customSubDomain,
      pathWithSearchParams,
      new URL(
        `/${customSubDomain}${pathWithSearchParams}`,
        request.url
      ).toString()
    );
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
