import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { ServerContext } from "../Contexts/ServerContext";
import { ChannelContext } from "../Contexts/ChannelContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Home/Home.css";
import tippy from "tippy.js";
import Modal from "../Modal/Modal";
import DeleteChannelModal from "../Modal/DeleteChannelModal";
import { BiSad } from "react-icons/bi";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale-extreme.css";
import ChannelSkeleton from "../Skeletons/ChannelSkeleton";
import { RiDeleteBin6Line } from "react-icons/ri";

const Server = ({ serverName, setMsgflag, setMsgLoading }) => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // delete channel states :dorime:
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false);
  const [channelData, setChannelData] = useState({});

  const { serverInfo } = useContext(ServerContext);

  const { channelInfo, setChannelInfo } = useContext(ChannelContext);
  const [hoveredElement, setHoveredElement] = useState(null);
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  let serverId = serverInfo.serverId;
  let { channelId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      const u = JSON.parse(localStorage.getItem("userInfo")).userId;
      setUserId(u);
    }, 500);
  }, []);

  useEffect(() => {
    if (serverInfo.serverId) {
      setIsLoading(true);
      showChannels();
      channelId && setMsgflag(true);
    } else {
      setIsLoading(true);
      showChannels();
    }
  }, [serverInfo]);
  useEffect(() => {
    setIsLoading(true);
    showChannels();
  }, [showModal]);
  useEffect(() => {
    showChannels();
  }, [showDeleteChannelModal]);
  useEffect(() => {
    setChannelInfo({
      ...channelInfo,
      channelId,
    });
  }, []);
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
    setMsgLoading(true);
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
  const deleteChannel = (data) => {
    setChannelData(data);
    setShowDeleteChannelModal(true);
  };
  const closeDeleteChannelModal = () => setShowDeleteChannelModal(false);
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
          [1, 2, 3].map((e) => {
            return <ChannelSkeleton key={e} />;
          })
        ) : channels.length === 0 ? (
          <div className="w-full text-gray-400 text-center flex flex-col justify-center items-center p-3 bg-gray-700/40 rounded-lg">
            <div className="my-2">You Don't have any rooms in your house</div>
            <BiSad size={"2rem"} />
            <p className="my-2">
              Click on + Button to add a room in your house...
            </p>
          </div>
        ) : (
          channels?.map((channel, idx) => {
            return (
              <div
                key={channel.id}
                onMouseEnter={() => setHoveredElement(idx)}
                onMouseLeave={() => setHoveredElement(null)}
                onClick={() =>
                  setChannel(channel.id, channel.serverId, channel.channelName)
                }
                className={`flex items-center hover:bg-[#24283b] cursor-pointer p-2 transition-all ease-in-out rounded-md ${
                  channelInfo.channelId === channel.id
                    ? " bg-[#343b58]"
                    : "text-gray-300"
                }`}
              >
                <HiOutlineChatAlt2 size={"1.1rem"} className="ml-1" />

                <p className="ml-2">{channel.channelName}</p>
                {hoveredElement === idx &&
                (userId === channel.ownerId ||
                  userId === serverInfo.serverOwnerId) ? (
                  <RiDeleteBin6Line
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deleteChannel({
                        channelName: channel.channelName,
                        channelId: channel.id,
                        currChannelId: channelInfo.channelId,
                        serverId,
                        api_secret: import.meta.env.VITE_APP_API_SECRET,
                      });
                    }}
                    className="ml-auto text-red-600/90 text-lg mr-2"
                  />
                ) : null}
              </div>
            );
          })
        )}
      </div>
      <Modal showModal={showModal} variant="Room" closeModal={closeModal} />
      <DeleteChannelModal
        showDeleteChannelModal={showDeleteChannelModal}
        data={channelData}
        setChannelInfo={setChannelInfo}
        setMsgFlag={setMsgflag}
        closeDeleteChannelModal={closeDeleteChannelModal}
      />
    </div>
  );
};

export default Server;
