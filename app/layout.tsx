import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hiragana Chart - Interactive Japanese Learning",
    template: "%s | Hiragana Chart",
  },
  description:
    "Master Japanese hiragana characters with our interactive chart-based learning platform. Practice pronunciation, test your knowledge, and track progress with AI-powered conversations and smart feedback.",
  keywords: [
    "hiragana",
    "japanese",
    "learning",
    "katakana",
    "japanese alphabet",
    "language learning",
    "pronunciation",
    "interactive learning",
    "japanese characters",
    "study japanese",
    "nihongo",
    "kana",
    "ai chart",
    "conversational learning",
  ],
  authors: [{ name: "Joshua", url: "https://twitter.com/47joshuaa" }],
  creator: "Joshua (@47joshuaa)",
  publisher: "Hiragana Chart",

  // Open Graph metadata for social media sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hiragana-chart.com", // Replace with your actual domain
    siteName: "Hiragana Chart",
    title: "Hiragana Chart - Interactive Japanese Learning",
    description:
      "Master Japanese hiragana characters with AI-powered chart conversations, audio pronunciation, and smart progress tracking.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hiragana Chart - Interactive Japanese Learning Platform",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Hiragana Chart - Interactive Japanese Learning",
    description:
      "Master Japanese hiragana characters with audio pronunciation.",
    images: ["/twitter-image.jpg"],
    creator: "@47joshuaa",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App-specific metadata
  applicationName: "Hiragana Chart",
  category: "Education",
  classification: "Educational Tool",

  // Verification (replace with your actual verification codes)
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },

  // Additional SEO metadata
  alternates: {
    canonical: "https://hiragana-chart.com", // Replace with your actual domain
    languages: {
      "en-US": "https://hiragana-chart.com/en",
      "ja-JP": "https://hiragana-chart.com/ja",
    },
  },

  // App icons and manifest
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },

  // Theme colors
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],

  // Additional app metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hiragana Chart",
  },

  // Format detection
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags that aren't covered by Next.js metadata API */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalApplication",
              name: "Hiragana Chart",
              description:
                "Interactive Japanese hiragana learning platform with audio pronunciation",
              url: "https://hiragana-chart.com",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              author: {
                "@type": "Person",
                name: "Joshua",
                sameAs: "https://twitter.com/47joshuaa",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              educationalLevel: "Beginner to Intermediate",
              learningResourceType: "Interactive Learning Tool",
              inLanguage: ["en", "ja"],
              about: {
                "@type": "Thing",
                name: "Japanese Language - Hiragana",
              },
              featureList: [
                "Audio pronunciation guide",
                "Interactive hiragana practice",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
