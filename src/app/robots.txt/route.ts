import { NextResponse } from "next/server";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://waitlist.hyperkitlabs.com";

export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
