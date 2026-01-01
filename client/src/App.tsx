import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import VideoCall from "./pages/VideoCall";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Layout route */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Chat />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chat-room" element={<ChatRoom />} />
                    <Route path="/video-call" element={<VideoCall />} />
                </Route>

                {/* Routes WITHOUT navbar */}
                {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
        </BrowserRouter>
    );
}
