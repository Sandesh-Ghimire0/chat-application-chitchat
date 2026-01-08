import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createUserQueryOptions } from "../queryOptions/createUserQueryOptions";

export default function MainLayout() {
    const { isPending } = useQuery(createUserQueryOptions());

    if (isPending) {
        return <div className="text-3xl font-semibold">Loading....</div>;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Navbar />

            {/* Remaining space after navbar */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
