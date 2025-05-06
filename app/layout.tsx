import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import { ActiveThemeProvider } from "@/components/active-theme";
import { Analytics } from "@/components/analytics";
import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { META_THEME_COLORS, siteConfig } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "SVFree",
    "Web chia sẻ tài liệu học tập miễn phí",
    "Tài liệu học tập miễn phí",
    "Tài liệu học tập",
    "Tài liệu học tập cho sinh viên",
  ],
  authors: [
    {
      name: "svfree",
      url: siteConfig.url,
    },
  ],
  creator: "svfree",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
    creator: "@svfree",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <Script id="theme-color-script" strategy="beforeInteractive">
          {`
            try {
              if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
              }
            } catch (_) {}
          `}
        </Script>
        <Script id="schema-script" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <Providers>{children}</Providers>
            <Toaster />
            <TailwindIndicator />
            <Analytics />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
