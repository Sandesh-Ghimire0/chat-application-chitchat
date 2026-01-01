import { useState, useEffect, useRef } from "react";
import "./App.css";

interface Clients {
    clientId: string;
    username: string;
}

const WS_URL = import.meta.env.VITE_WS_URL

function App() {
    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<
        Array<{ sendBy: string; sendTo: string; message: string }>
    >([]);
    const [input, setInput] = useState<string>("");
    const [clients, setClients] = useState<Clients[]>([]);
    const [clientId, setClientId] = useState<string>("");
    const [targetId, setTargetId] = useState<string>("");
    const [targetName, setTargetName] = useState<string>("");

    useEffect(() => {
        const socket = new WebSocket(WS_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Client connected to ", WS_URL);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "client-id") {
                setClientId(data.clientId);
            }

            if (data.type === "all-clients") {
                setClients(data.allClients);
            }

            if (data.type === "chat-message") {
                setMessages((prev) => [
                    ...prev,
                    {
                        sendBy: data.sendBy,
                        sendTo: data.sendTo,
                        message: data.message,
                    },
                ]);
            }
        };

        socket.onerror = (error) => {
            console.log("Socket error: ", error);
        };

        return () => {
            console.log("clean up code");
            socket.close();
        };
    }, []);


    const sendMessage = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    from:clientId,
                    to: targetId,
                    message: input,
                })
            );
            setInput("");
        }
    };

    const handleTargetClick = (id: string, username: string) => {
        setTargetId(id);
        setTargetName(username);
    };

    return (
        <>
            <div className="flex h-screen bg-gray-100 p-4 gap-4">
                {/* Left Section */}
                <div className="w-1/4 bg-white rounded-lg shadow p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Clients</h2>
                    <ul className="space-y-2">
                        {clients?.map((client) => (
                            <li
                                key={client.clientId}
                                onClick={() =>
                                    handleTargetClick(
                                        client.clientId,
                                        client.username
                                    )
                                }
                                className="cursor-pointer p-2 rounded hover:bg-blue-100 transition"
                            >
                                {client.username}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    {
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Send message to {targetName}
                            </h2>

                            {/* Input Section */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Type a message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Send
                                </button>
                            </div>

                            {/* Messages List */}
                            <ul className="flex flex-col overflow-y-auto space-y-2">
                                {messages?.map((msg, i) => {
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
                                })}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default App;
