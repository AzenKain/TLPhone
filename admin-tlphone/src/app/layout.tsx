"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Providers from "@/components/Providers/Providers";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeModeScript } from "flowbite-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html data-theme="winter" lang="en">
      <head>
        <title>TLPhone ADMIN</title>
        <meta name='description' content='Description' />
        <ThemeModeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>
          <StoreProvider>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {loading ?
                <Loader /> :
                (
                  <DefaultLayout>
                    {children}
                  </DefaultLayout>
                )
              }
            </div>
          <ToastContainer className="z-[1000]"/>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
