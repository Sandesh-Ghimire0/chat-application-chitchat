import { useAuthUser } from "../hooks/useAuthUser";
import type { Friend, User } from "../types/client";
import { useParams } from "react-router-dom";
import Message from "../components/Message";
import Friends from "../components/Friends";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

const WS_URL = import.meta.env.VITE_WS_URL;

function Chat() {
    const { id } = useParams();
    const user = useAuthUser() as User;

    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`${WS_URL}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("User connected to ", WS_URL);
            socket.send(
                JSON.stringify({
                    type: "connect",
                    userId: user.id,
                })
            );
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "active-user") {
                queryClient.setQueryData(["friends"], (old: Friend[]) => {
                    return old?.map((friend) => ({
                        ...friend,
                        isActive:
                            data.activeUserId === friend.id
                                ? true
                                : friend.isActive,
                    }));
                });
            }

            if (data.type === "deactive-user") {
                queryClient.setQueryData(["friends"], (old: Friend[]) => {
                    console.log(data);
                    return old?.map((friend) => ({
                        ...friend,
                        isActive:
                            data.deactiveUserId === friend.id
                                ? false
                                : friend.isActive,
                    }));
                });
            }
        };

        return () => {
            console.log("clean up code");
            socket.close();
        };
    }, []);

    return (
        <>
            <div className="flex h-full p-4 gap-4">
                {/* Left Section */}
                <Friends userId={user.id} />

                {/* Right Section */}
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    {id ? (
                        <Message userId={user.id} targetId={id} />
                    ) : (
                        <div className="text-4xl font-semibold">
                            Welcome to ChitChat
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Chat;
