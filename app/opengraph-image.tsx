import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = siteConfig.name;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  try {
    // Đảm bảo font được tải
    const interSemiBold = fetch(
      new URL(
        "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(125deg, #4b6cb7 0%, #182848 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "20px 50px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "white",
                  marginRight: 32,
                  fontSize: 70,
                  fontWeight: "bold",
                  color: "#4b6cb7",
                }}
              >
                SV
              </div>
              <h1
                style={{
                  fontSize: 70,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                  margin: 0,
                  padding: 0,
                }}
              >
                {siteConfig.name}
              </h1>
            </div>

            <p
              style={{
                fontSize: 32,
                color: "white",
                textAlign: "center",
                maxWidth: 800,
                lineHeight: 1.4,
              }}
            >
              {siteConfig.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 40,
                padding: "12px 24px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 12,
              }}
            >
              <p style={{ color: "white", fontSize: 24, margin: 0 }}>
                Web Chia Sẻ Tài Liệu Học Tập Miễn Phí
              </p>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: await interSemiBold,
            style: "normal",
            weight: 600,
          },
        ],
      }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <h1>{siteConfig.name}</h1>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
