import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f5f5f3",
    theme_color: "#f5f5f3",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
