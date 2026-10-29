import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ href: "/" }, ...nav].map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    changeFrequency: "weekly",
    priority: href === "/" ? 1 : 0.7,
  }));
}
