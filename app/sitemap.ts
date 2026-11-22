import type { MetadataRoute } from "next";
import { catalog } from "../lib/store";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "/",
    "/highlights",
    "/originals",
    "/bundesliga",
    "/submit",
    "/about",
    ...(await catalog()).map((x) => "/highlights/" + x.id),
  ];
  return paths.map((p) => ({ url: "https://okhockey.de" + p }));
}
