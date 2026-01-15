import type { ReactNode } from "react";
import Navbar from "./Navbar";

export function Layout({ children }: { children: ReactNode }) {


    return <>
        <Navbar />
        {children}
    </>;
}