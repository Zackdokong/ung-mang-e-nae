import { Routes, Route } from "react-router-dom";
import React from "react";
import MainPage from "./pages/main/mainpage";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import TeamSetting from "./pages/team/TeamSetting";

function Router() {
    return(<Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-team" element={<TeamSetting />} />
    </Routes>);
}

export default Router;