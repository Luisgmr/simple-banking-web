import type { Metadata } from "next";
import "./globals.css";
import { Rethink_Sans } from "next/font/google"
import {Navbar} from "@/components/Navbar";
import {Toaster} from "react-hot-toast";

const rethinkSans = Rethink_Sans({
    subsets: ["latin"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "Banking",
    description: "Aplicação bancária simples",
    icons: {
        icon: 'eth_logo.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="pt-BR" className={rethinkSans.className}>
            <body className={"antialiased"}>
                <Toaster position="top-center" />
                <div className={"flex flex-col p-4 gap-2 max-w-screen-md justify-self-center w-full"}>
                    <Navbar/>
                    {children}
                </div>
            </body>
        </html>
    );
}
