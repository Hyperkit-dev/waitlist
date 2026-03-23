import { NextResponse } from "next/server";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://waitlist.hyperkitlabs.com";

export function GET() {
  const urls = [
    { loc: baseUrl, lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/confirmed`, lastmod: new Date().toISOString().split("T")[0], changefreq: "monthly", priority: "0.5" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
