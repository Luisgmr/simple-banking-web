import {PersonSection} from "@/app/(both-routes)/pessoa/components/PersonSection";
import {AnimatePresence} from "framer-motion";

export default function PessoaPage() {
    return (
        <AnimatePresence mode={'wait'}>
            <PersonSection />
        </AnimatePresence>
    );
}