import type { ReactNode } from "react";
import Navbar from "./Navbar";
import { useSignalR } from "../../hooks/useSignalR";

export function Layout({ children }: { children: ReactNode }) {
    useSignalR();

    return <>
        <Navbar />
        {children}
    </>;
}