import React from "react";
import { useContext } from "react";
import { ChannelContext } from "../Contexts/ChannelContext";
import { useNavigate } from "react-router-dom";
import { ServerContext } from "../Contexts/ServerContext";

const Channel = ({ id, channelName }) => {
  const { serverInfo, setServerInfo } = useContext(ServerContext);
  const { setChannelInfo } = useContext(ChannelContext);
  const navigate = useNavigate();
  const setChannel = () => {
    setChannelInfo({
      channelId: id,
      channelName: channelName,
    });
    navigate(`/dashboard/${serverInfo.serverName}/${id}`);
  };
  return (
    <>
      <div
        className="flex cursor-pointer hover:bg-slate-700 transition-all ease-in-out p-2 hover:rounded-lg border-b-2 border-slate-600"
        onClick={setChannel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
          />
        </svg>
        <p>{channelName}</p>
      </div>
    </>
  );
};

export default Channel;
