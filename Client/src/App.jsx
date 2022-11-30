import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile"
import { useState } from "react";
import { ChannelContext } from "./components/Contexts/ChannelContext";
import { ServerContext } from "./components/Contexts/ServerContext";
import Server from "./components/Server/Server";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const [channelInfo, setChannelInfo] = useState({
    channelId: null,
    channelName: null,
  });
  const [serverInfo, setServerInfo] = useState({
    serverName: "wearenoobs",
    serverId: "634c006b3ffcbff96aa486b7",
  });

  return (
    <>
      <ReactQueryDevtools />
      <ServerContext.Provider value={{ serverInfo, setServerInfo }}>
        <ChannelContext.Provider value={{ channelInfo, setChannelInfo }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/dashboard/:serverId" element={<Home />} />
            <Route path="/dashboard/:serverId/:channelId" element={<Home />} />
          </Routes>
        </ChannelContext.Provider>
      </ServerContext.Provider>
    </>
  );
}

export default App;
