import { NavLink } from "react-router-dom";

export default function Navbar() {
    const linkClass = ({ isActive }: {isActive:boolean}) =>
        `px-4 py-2 rounded-md text-sm font-medium transition
     ${
         isActive
             ? "bg-blue-600 text-white"
             : "text-gray-600 hover:text-blue-600"
     }`;

     return (
        <nav className="sticky top-0 z-50 bg-white">
            <div className="mx-auto max-w-8xl px-4">
                <div className="flex h-14 items-center gap-4">
                    <NavLink to="/chat" className={linkClass}>
                        Chat
                    </NavLink>

                    <NavLink to="/chat-room" className={linkClass}>
                        Chat Room
                    </NavLink>

                    <NavLink to="/video-call" className={linkClass}>
                        Video Call
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
