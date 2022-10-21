import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import { useState } from "react";
import { ChannelContext } from "./components/Contexts/ChannelContext";
import { ServerContext } from "./components/Contexts/ServerContext";
import Server from "./components/Server/Server";

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
      <ServerContext.Provider value={{ serverInfo, setServerInfo }}>
        <ChannelContext.Provider value={{ channelInfo, setChannelInfo }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
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
