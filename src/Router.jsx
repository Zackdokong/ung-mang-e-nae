import { Routes, Route } from "react-router-dom";
import React from "react";
import MainPage from "./pages/main/mainpage";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import TeamSetting from "./pages/team/TeamSetting";
import ChatRoom from "./pages/chatroom/chatroom";

function Router() {
    return(<Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-team" element={<TeamSetting />} />
        <Route path="/chatroom/:slug" element={<ChatRoom />} />
    </Routes>);
}

export default Router;