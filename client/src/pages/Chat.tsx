import { useAuthUser } from "../hooks/useAuthUser";
import type { ConnectUserMessage, Friend, User } from "../types/type";
import { useParams } from "react-router-dom";
import Messages from "../components/Messages";
import Friends from "../components/Friends";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "../types/type";
import { createFriendsQueryOptions } from "../queryOptions/createFriendsQueryOptions";

const WS_URL = import.meta.env.VITE_WS_URL;

function Chat() {
    const { id } = useParams<{ id: string }>();
    const user = useAuthUser() as User;

    const [targetName, setTargetName] = useState("");
    const { data: friends, isPending: isFriendPending } = useQuery(
        createFriendsQueryOptions(user.id)
    );

    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`${WS_URL}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("User connected to ", WS_URL);
            const payload: ConnectUserMessage = {
                type: "connect",
                userId: user.id,
            };
            socket.send(JSON.stringify(payload));
        };

        socket.onmessage = (event) => {
            const data: Message = JSON.parse(event.data);
            if (data.type === "active-user") {
                queryClient.setQueryData(["friends"], (old: Friend[]) => {
                    return old?.map((friend) => ({
                        ...friend,
                        isOnline:
                            data.activeUserId === friend.id
                                ? true
                                : friend.isOnline,
                    }));
                });
            }

            if (data.type === "deactive-user") {
                queryClient.setQueryData(["friends"], (old: Friend[]) => {
                    return old?.map((friend) => ({
                        ...friend,
                        isOnline:
                            data.deactiveUserId === friend.id
                                ? false
                                : friend.isOnline,
                    }));
                });
            }

            if (data.type === "chat-message") {
                queryClient.setQueryData(["message"], (old: Message[]) => {
                    // when user sign up there is no old or when user is talking to new user
                    return [
                        ...(old ?? []),
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

    useEffect(() => {
        if (id && !isFriendPending) {
            const currFriend = friends?.find((friend) => friend.id === id);
            setTargetName(currFriend?.username ?? "");
        }
    }, [isFriendPending]);

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
                {isFriendPending ? (
                    <div className="font-semibold text-shadow-md">
                        Loading....
                    </div>
                ) : (
                    <Friends
                        friends={friends}
                        userId={user.id}
                        setTargetName={setTargetName}
                    />
                )}

                {/* Right Section */}
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    {id ? (
                        <>
                            <h2 className="text-xl font-medium text-center  mb-5">
                                {targetName}
                            </h2>
                            <Messages
                                userId={user.id}
                                targetId={id}
                                sendMessage={sendMessage}
                            />
                        </>
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
