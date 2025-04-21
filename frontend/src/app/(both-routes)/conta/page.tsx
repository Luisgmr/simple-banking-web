import {AccountSection} from "@/app/(both-routes)/conta/components/AccountSection";
import {AnimatePresence} from "framer-motion";

export default function ContaPage() {
    return (
        <AnimatePresence mode={'wait'}>
            <AccountSection/>
        </AnimatePresence>
    );
}