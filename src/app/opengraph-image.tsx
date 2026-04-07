import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 20, display: "flex" }}>
          🪑
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
          }}
        >
          座位表生成器
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            display: "flex",
          }}
        >
          在线班级座位编排工具
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.7,
            marginTop: 24,
            display: "flex",
          }}
        >
          seat.toolboxlite.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
