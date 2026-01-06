import { useAuthUser } from "../hooks/useAuthUser";
import type {  ConnectUserMessage, Friend, User } from "../types/type";
import { useParams } from "react-router-dom";
import Messages from "../components/Messages";
import Friends from "../components/Friends";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "../types/type";

const WS_URL = import.meta.env.VITE_WS_URL;

function Chat() {
    const { id } = useParams<{ id: string }>();
    const user = useAuthUser() as User;

    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`${WS_URL}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("User connected to ", WS_URL);
            const payload: ConnectUserMessage = {
                type: "connect",
                userId: user.id
            }
            socket.send(
                JSON.stringify(payload)
            );
        };

        socket.onmessage = (event) => {
            const data: Message = JSON.parse(event.data);
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
                    return old?.map((friend) => ({
                        ...friend,
                        isActive:
                            data.deactiveUserId === friend.id
                                ? false
                                : friend.isActive,
                    }));
                });
            }

            if (data.type === "chat-message") {
                queryClient.setQueryData(["message"], (old: Message[]) => {
                    return [
                        ...old,
                        {
                            id: data.id,
                            from: data.from,
                            to: data.to,
                            content: data.content,
                        },
                    ];
                });
            }
        };

        return () => {
            console.log("clean up code");
            socket.close();
        };
    }, []);

    const sendMessage = (msg: string) => {
        if (!id) return;
        const payload: Message = {
            type: "chat-message",
            from: user.id,
            to: id,
            content: msg,
        };
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(payload));
        }
    };

    return (
        <>
            <div className="flex h-full p-4 gap-4">
                {/* Left Section */}
                <Friends userId={user.id} />

                {/* Right Section */}
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    {id ? (
                        <Messages
                            userId={user.id}
                            targetId={id}
                            sendMessage={sendMessage}
                        />
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
