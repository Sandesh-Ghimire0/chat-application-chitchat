
import { useAuthUser } from "../hooks/useAuthUser";
import type { User } from "../types/client";
import {  useParams } from "react-router-dom";
import Message from "../components/Message";
import Friend from "../components/Friend";

function Chat() {

    const { id } = useParams();
    const user = useAuthUser() as User;

    return (
        <>
            <div className="flex h-full p-4 gap-4">
                {/* Left Section */}
                <Friend  userId={user.id}/>

                {/* Right Section */}
                <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
                    {id ? (
                        <Message userId={user.id} targetId={id}/>
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
