import type { Metadata } from "next";
import { DEFAULT_ILLUSTRATION, ILLUSTRATION_HEIGHT, ILLUSTRATION_WIDTH } from "@/lib/images/display";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GA_MEASUREMENT_ID = "G-WD7Z99J5TZ";
const GTM_ID = "GTM-WLQMN5PV";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Latest Car Accident News by State | CarCrashReport.com",
    template: "%s | CarCrashReport.com",
  },
  description:
    "Up-to-date traffic accident news from across the United States, organized by state, with plain-language summaries and links to the original reports.",
  verification: {
    google: "D9Biju710LGgiW2HPc7lJzEAUIWRDCplmahAuE7ohE0",
  },
  openGraph: {
    siteName: "CarCrashReport.com",
    type: "website",
    locale: "en_US",
    images: [{ url: DEFAULT_ILLUSTRATION.src, width: ILLUSTRATION_WIDTH, height: ILLUSTRATION_HEIGHT, alt: DEFAULT_ILLUSTRATION.alt }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: DEFAULT_ILLUSTRATION.src, alt: DEFAULT_ILLUSTRATION.alt }],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main className="flex-grow pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
