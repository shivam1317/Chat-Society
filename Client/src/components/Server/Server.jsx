import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ServerContext } from "../Contexts/ServerContext";
import { collection, addDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase-config";
import Channel from "../Channel/Channel";
import axios from "axios";
import "../Home/Home.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale-extreme.css";

const Server = ({ serverName }) => {
  const [channels, setChannels] = useState([]);
  const { serverInfo } = useContext(ServerContext);
  const { serverId } = useParams();
  useEffect(() => {
    showChannels();
  }, [serverInfo]);
  const addChannel = async () => {
    try {
      const channelName = prompt("Enter channel name");
      if (channelName) {
        const res = await axios.post(
          "http://localhost:5000/channelapi/createchannel",
          {
            channelName,
            serverId,
          }
        );
      }
      showChannels();
    } catch (error) {
      console.log(error.message);
    }
  };
  const showChannels = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/channelapi/channels/${serverId}`
      );
      setChannels(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  // showChannels();
  tippy("#addChannel", {
    content: "Add Channel",
    animation: "scale-extreme",
  });
  return (
    <div className="channels p-2 border-2 border-transparent rounded-tl-2xl h-full">
      <div className="text-center border-b-2 border-[#26263d] mt-2 flex justify-between p-3">
        <h1 className="text-lg">{serverName}</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          onClick={addChannel}
          id="addChannel"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <div className="flex flex-col space-y-2 mt-3 overflow-y-scroll scrollbar-hide">
        {channels.map((channel) => {
          {
            /* <Channel
            id={doc.id}
            channelName={doc.data().channelName}
            key={doc.id}
          /> */
          }
          return <div>{channel.channelName}</div>;
        })}
      </div>
    </div>
  );
};

export default Server;
