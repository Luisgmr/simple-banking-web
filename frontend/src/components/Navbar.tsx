"use client"

import { usePathname } from "next/navigation";
import {Bank, House, Repeat, User, Wallet} from "phosphor-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useEffect} from "react";

export function Navbar() {
    const path = usePathname();

    useEffect(() => {
        console.log(path)
    }, [path]);


    const routes = [
        { href: "/pessoa", label: "Pessoa", icon: <User weight={"fill"} className={"w-12 hauto shrink-0 md:w-18"}/> },
        { href: "/conta", label: "Conta", icon: <Bank weight={"fill"} className={"w-12 h-auto shrink-0 md:w-18"}/> },
        { href: "/movimentacao", label: "Movimentação", icon: <Wallet weight={"fill"} className={"w-12 h-auto shrink-0 md:w-18"}/> },
    ];
    return (
        <nav className="bg-white rounded-lg p-4 px-24 flex gap-10 w-full justify-center">
            {routes.map((r) => (
                <Link key={r.href} href={r.href} passHref>
                    <Button
                        variant={"ghost"}
                        className={`w-full justify-start gap-3 !p-5 text-black text-lg
                            ${path == r.href && (`bg-gray-100`)}
                        `}
                    >
                        {r.icon}
                        <span className="hidden md:inline">{r.label}</span>
                    </Button>
                </Link>
            ))}
        </nav>
    );
}