"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";
import {Button} from "@/components/ui/button";

interface AnimatedButtonProps extends React.ComponentProps<"button"> {
    tapScale?: number;
    hoverScale?: number;
    transition?: any;
    wrapperClassName?: string;
}

export function AnimatedButton({
    tapScale = 0.975,
    hoverScale = 1.025,
    transition = { type: "spring", stiffness: 400, damping: 10 },
    wrapperClassName,
    className,
    ...buttonProps
}: AnimatedButtonProps) {
    return (
        <motion.div
            className={cn("inline-flex", wrapperClassName)}
            whileTap={{ scale: tapScale }}
            whileHover={{ scale: hoverScale }}
            transition={transition}
        >
            <Button
                className={cn(
                    "cursor-pointer transform-none",
                    className
                )}
                {...buttonProps}
            />
        </motion.div>
    );
}