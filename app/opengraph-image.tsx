import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", site.logo.src));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const logoWidth = 360;
  const logoHeight = Math.round((logoWidth * site.logo.height) / site.logo.width);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#f5f5f3",
        backgroundImage:
          "linear-gradient(to right, rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.06) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        color: "#0a0a0a",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ width: 56, height: 6, background: "#737373", transform: "skewX(-12deg)" }} />
        <div
          style={{ fontSize: 68, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05, maxWidth: 900 }}
        >
          {site.tagline}
        </div>
      </div>
    </div>,
    size,
  );
}
