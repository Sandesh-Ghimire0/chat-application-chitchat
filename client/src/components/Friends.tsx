import { useQuery } from "@tanstack/react-query";
import { createFriendsQueryOptions } from "../queryOptions/createFriendsQueryOptions";
import { useNavigate } from "react-router-dom";

interface FriendProps {
    userId: string;
}

function Friends({ userId }: FriendProps) {
    const { data: friends } = useQuery(createFriendsQueryOptions(userId));
    const navigate = useNavigate();

    const handleTargetClick = (targetId: string) => {
        navigate(`/chat/${targetId}`);
    };

    return (
        <div className="w-1/4 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Clients</h2>
            <ul className="space-y-2">
                {friends?.map((friend) => (
                    <li className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-blue-100 transition">
                        <div
                            key={friend.id}
                            onClick={() => handleTargetClick(friend.id)}
                        >
                            {friend.username}
                        </div>
                        {friend.isActive ? (
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
