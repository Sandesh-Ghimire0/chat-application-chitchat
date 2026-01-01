import { useAppSelector } from "../hooks/dispatchSelector";


function Chat() {
    const friends = useAppSelector( state => state.friend)

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
                        Send message to
                    </h2>

                    {/* Messages */}
                    <ul className="flex-1 flex flex-col overflow-y-auto space-y-2 pb-4">
                        {/* {messages?.map((msg, i) => {
                            if (
                                msg.sendBy === targetId ||
                                msg.sendTo === targetId
                            ) {
                                return (
                                    <li
                                        key={i}
                                        className={`max-w-[70%] p-3 rounded-2xl ${
                                            msg.sendBy === clientId
                                                ? "bg-blue-700 text-white self-end"
                                                : "bg-gray-100 self-start"
                                        }`}
                                    >
                                        {msg.message}
                                    </li>
                                );
                            }
                        })} */}
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
