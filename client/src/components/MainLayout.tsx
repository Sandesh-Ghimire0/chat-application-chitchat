import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

import { useEffect } from "react";
import { getFriends } from "../services/user";
import { useAppDispatch, useAppSelector } from "../hooks/dispatchSelector";
import { addFriends } from "../store/friendSlice";

export default function MainLayout() {
    const user = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const fetchFriends = async (userId: string) => {
        const res = await getFriends(userId);
        if (res?.status === 200) {
            dispatch(addFriends(res.data.data));
        }
    };
    useEffect(() => {
        fetchFriends(user.id);
    }, []);
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
