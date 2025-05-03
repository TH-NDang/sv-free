import { siteConfig } from "@/config/site";

import type { Metadata } from "next";
export const experimental_ppr = true;

export const metadata: Metadata = {
  title: "Trang chủ",
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};

export default async function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4 text-center sm:p-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-4xl">
          Nghiên cứu khiến bạn thông minh hơn
        </h1>
        <p className="text-muted-foreground mb-4 max-w-2xl text-sm sm:mb-6 sm:text-base">
          Tìm kiếm tài liệu, bài báo và nghiên cứu từ hàng triệu nguồn khác
          nhau.
          <br />
          <span className="text-foreground text-sm font-medium">
            Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"></div>
    </div>
  );
}
