import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
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

