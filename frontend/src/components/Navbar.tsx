"use client"

import { usePathname } from "next/navigation";
import {Bank, CurrencyEth, Users, Wallet} from "phosphor-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
    const path = usePathname();

    const routes = [
        { href: "/pessoa", label: "Pessoa", icon: <Users weight={"fill"} /> },
        { href: "/conta", label: "Conta", icon: <Bank weight={"fill"} /> },
        { href: "/movimentacao", label: "Movimentação", icon: <Wallet weight={"fill"} /> },
    ];
    return (
        <nav className={"bg-white w-full rounded-lg p-4 flex justify-between"}>
            <div className={"flex items-center gap-1"}>
                <CurrencyEth className={"w-6 h-auto shrink-0"} weight="fill" />
                <p className={"font-light text-lg"}>Banking</p>
            </div>
            <div className="bg-white rounded-lg flex gap-2 justify-center w-auto">
                {routes.map((r) => (
                    <motion.div
                        key={r.href}
                        whileTap={{scale:0.95}}
                        whileHover={{ scale:1.05 }}
                    >
                        <Link href={r.href} passHref>
                            <Button
                                variant={"ghost"}
                                className={`w-full flex flex-col sm:flex-row gap-1.5 !p-4 text-black text-sm
                            ${path == r.href && (`bg-gray-100`)}
                        `}
                            >
                                {r.icon}
                                <p className="hidden sm:flex">{r.label}</p>
                            </Button>
                        </Link>
                    </motion.div>

                ))}
            </div>
        </nav>
    );
}