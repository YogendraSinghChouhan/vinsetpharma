import { ImageResponse } from "next/og";
import { BRAND_COLORS, SITE_NAME, SITE_TAGLINE } from "@/config/site";

export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: BRAND_COLORS.primary,
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: BRAND_COLORS.accentLight,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        Pharmaceutical Excellence
      </div>
      <div
        style={{
          fontSize: "68px",
          fontWeight: 800,
          color: BRAND_COLORS.foregroundOnDark,
          lineHeight: 1.1,
          marginBottom: "24px",
        }}
      >
        {SITE_NAME}
      </div>
      <div
        style={{
          fontSize: "30px",
          fontWeight: 400,
          color: BRAND_COLORS.mutedOnDark,
          maxWidth: "920px",
          lineHeight: 1.4,
        }}
      >
        {SITE_TAGLINE}
      </div>
    </div>,
    {
      ...size,
    },
  );
}
