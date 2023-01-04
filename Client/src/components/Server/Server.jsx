import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { ServerContext } from "../Contexts/ServerContext";
import { UserContext } from "../Contexts/UserContext";
import { collection, addDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import Channel from "../Channel/Channel";
import { ChannelContext } from "../Contexts/ChannelContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Home/Home.css";
import tippy from "tippy.js";
import Modal from "../Modal/Modal";
import { BiSad } from "react-icons/bi";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale-extreme.css";
import "./Server.css";
import ChannelSkeleton from "../Skeletons/ChannelSkeleton";

const Server = ({ serverName, setMsgflag }) => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { serverInfo } = useContext(ServerContext);
  const { channelInfo, setChannelInfo } = useContext(ChannelContext);
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  const serverId = serverInfo.serverId;
  const { channelId } = useParams();
  useEffect(() => {
    setIsLoading(true);
    showChannels();
  }, [serverInfo]);
  useEffect(() => {
    setIsLoading(true);
    showChannels();
  }, [showModal]);
  useEffect(() => {
    setChannelInfo({
      ...channelInfo,
      channelId,
    });
  }, []);
  const addChannel = async () => {
    try {
      const channelName = prompt("Enter channel name");
      if (channelName) {
        const res = await axios.post(`${backendURL}/channelapi/createchannel`, {
          channelName,
          serverId,
        });
      }
      showChannels();
    } catch (error) {
      console.log(error.message);
    }
  };
  const showChannels = async () => {
    try {
      if (serverId) {
        const res = await axios.get(
          `${backendURL}/channelapi/channels/${serverId}`
        );
        setChannels(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const setChannel = (id, sid, cname) => {
    setChannelInfo({
      channelId: id,
      channelName: cname,
    });
    setMsgflag(true);
    navigate(`/dashboard/${sid}/${id}`);
  };
  tippy("#addChannel", {
    content: "Add Channel",
    animation: "scale-extreme",
  });
  // Modal Functions
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="channels p-2 border-2 border-transparent rounded-tl-2xl h-full">
      <div className="text-center border-b-2 border-[#26263d] mt-2 flex justify-between p-3">
        <h1 className="text-lg">{serverName ? serverName : "HouseName"}</h1>
        {serverId ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            onClick={() => setShowModal(true)}
            id="addChannel"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ) : null}
      </div>
      <div className="flex flex-col space-y-2 mt-3 overflow-y-scroll scrollbar-hide w-full">
        {isLoading && serverId ? (
          [1, 2, 3].map(() => {
            return <ChannelSkeleton />;
          })
        ) : channels.length === 0 ? (
          <div className="w-full text-gray-300 text-center flex flex-col justify-center items-center p-3 bg-gray-700 rounded-lg">
            <div className="my-2">You Don't have any rooms in your house</div>
            <BiSad size={"2rem"} />
            <p className="my-2">
              Click on + Button to add a room in your house...
            </p>
          </div>
        ) : (
          channels?.map((channel) => {
            return (
              <div
                key={channel.id}
                onClick={() =>
                  setChannel(channel.id, channel.serverId, channel.channelName)
                }
                className={`flex items-center  cursor-pointer p-2 transition-all ease-in-out rounded-md ${
                  channelInfo.channelId === channel.id
                    ? "activeChannel text-gray-200 font-semibold"
                    : "text-gray-300"
                }`}
              >
                <HiOutlineChatAlt2 size={"1.1rem"} className="ml-1" />
                <p className="ml-2">{channel.channelName}</p>
              </div>
            );
          })
        )}
      </div>
      <Modal showModal={showModal} variant="Room" closeModal={closeModal} />
    </div>
  );
};

export default Server;
