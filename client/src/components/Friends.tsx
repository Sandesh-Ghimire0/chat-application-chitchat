import { useNavigate } from "react-router-dom";
import type { Friend } from "../types/type";

interface FriendProps {
    friends: Friend[] | undefined;
    userId: string;
    setTargetName: (name: string) => void;
}

function Friends({ friends, setTargetName }: FriendProps) {
    const navigate = useNavigate();

    const handleTargetClick = (name: string, targetId: string) => {
        setTargetName(name);
        navigate(`/chat/${targetId}`);
    };

    return (
        <div className="w-1/4 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Clients</h2>
            <ul className="space-y-2">
                {friends?.map((friend: Friend) => (
                    <li
                        key={friend.id}
                        className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-blue-100 transition"
                    >
                        <div
                            className="flex items-center gap-3"
                            onClick={() =>
                                handleTargetClick(friend.username, friend.id)
                            }
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src={friend.image}
                                    alt={friend.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {friend.username}
                        </div>

                        {friend.isOnline ? (
                            <div className="text-green-500 text-sm">Active</div>
                        ) : (
                            ""
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Friends;
