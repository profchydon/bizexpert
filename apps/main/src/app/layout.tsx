import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/vendorDocViewerCss";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/lib/providers";
import Script from "next/script";
import { Toaster } from "sonner";

import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import { PHProvider, PostHogPageview } from "@/lib/PostHog";
import { IBM_Plex_Sans } from "next/font/google";
import { cx } from "@/utils/cx";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rayda Remote",
  description: "Rayda Remote",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cx(
          ibmPlexSans.variable,
          ibmPlexSans.className,
          "bg-primary antialiased",
        )}
      >
        <noscript>
          <iframe
            title="Google Tag Manager"
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTMANAGER}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <NextTopLoader color="#004CCC" height={4} showSpinner={false} />

        <Providers>
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <PHProvider>
            <div>{children}</div>
          </PHProvider>
        </Providers>
        <Toaster position="top-right" richColors />
        <div id="modal-root"></div>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
          }}
        />
        <GoogleTagManager gtmId={`${process.env.NEXT_PUBLIC_GTMANAGER}`} />
        <Script
          id="canny-sdk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");`,
          }}
        />
      </body>
    </html>
  );
}
