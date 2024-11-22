"use client"
import { Inter } from "next/font/google";
import React from 'react'
import "./globals.css";
import Providers from "@/components/Providers/Providers";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/header";
import Footer from "@/components/footer";
import "@/css/styles.css";
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html data-theme="winter" lang="en">
            <head>
                <title>TLPhoneShop</title>
                <meta name='description' content='Description' />
                <link rel="apple-touch-icon.png" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="x-icon" sizes="16x16" href="/favicon.ico" />
                <link rel="manifest" crossOrigin="use-credentials" href="/manifest.json" />
                <script src="/js/jquery-3.7.1.min.js"></script>
            </head>
            <body className={`${inter.className} selection:bg-base-content selection:text-base-100`} style={{ background: "rgba(128, 128, 128, 0.1)" }}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
                <Providers>
                    <StoreProvider>
                        <Header />
                        <div className="body mx-40 my-8">
                            {children}
                        </div>
                        <Footer />
                        <ToastContainer />
                    </StoreProvider>
                </Providers>
            </body>
        </html>
    );
}