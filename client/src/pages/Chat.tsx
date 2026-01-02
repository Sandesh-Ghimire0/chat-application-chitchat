import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../hooks/dispatchSelector";
import { useState } from "react";
import { createFriendsQueryOptions } from "../queryOptions/createFriendsQueryOptions";
import { createMessagesQueryOptions } from "../queryOptions/createMessageQueryOptions";

function Chat() {
    // const friends = useAppSelector( state => state.friend)

    const user = useAppSelector((state) => state.auth);

    const [targetId, setTargetId] = useState("");

    const { data: friends } = useQuery(createFriendsQueryOptions());
    const { data: messages } = useQuery(createMessagesQueryOptions());

    console.log(messages);

    return (
        <>
            <div className="flex h-full p-4 gap-4">
                {/* Left Section */}
                <div className="w-1/4 bg-white rounded-lg shadow p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Clients</h2>
                    <ul className="space-y-2">
                        {friends?.map((friend) => (
                            <li
                                key={friend.id}
                                onClick={() => setTargetId(friend.id)}
                                className="cursor-pointer p-2 rounded hover:bg-blue-100 transition"
                            >
                                {friend.username}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">
                        Send message to {targetId}
                    </h2>

                    {/* Messages */}
                    <ul className="flex-1 flex flex-col overflow-y-auto space-y-2 pb-4">
                        {messages
                            ?.filter(
                                (msg) =>
                                    // Only show messages belonging to this specific conversation
                                    (msg.userId === user.id &&
                                        msg.sentTo === targetId) ||
                                    (msg.userId === targetId &&
                                        msg.sentTo === user.id)
                            )
                            .map((msg) => (
                                <li
                                    key={msg.id}
                                    className={`max-w-[70%] p-3 rounded-2xl ${
                                        // Blue/Right if I sent it, Gray/Left if Friend sent it
                                        msg.userId === user.id
                                            ? "bg-blue-700 text-white self-end rounded-br-none"
                                            : "bg-gray-200 text-black self-start rounded-bl-none"
                                    }`}
                                >
                                    {msg.content}
                                </li>
                            ))}
                    </ul>

                    {/* Fixed Input Section */}
                    <div className="flex gap-2 border-t pt-3">
                        <input
                            type="text"
                            // value={input}
                            // onChange={(e) => setInput(e.target.value)}
                            // onKeyDown={(e) => {
                            //     if (e.key === "Enter") {
                            //         sendMessage();
                            //     }
                            // }}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Type a message..."
                        />
                        <button
                            // onClick={sendMessage}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;
