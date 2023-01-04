import React, { Fragment, useEffect, useState, useRef } from "react";
import "./Home.css";
import brand_image from "../../../public/images/index/brand_icon.png";
import { FiUser } from "react-icons/fi";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc } from "firebase/firestore";
import { useContext } from "react";
import { ChannelContext } from "../Contexts/ChannelContext";
import { ServerContext } from "../Contexts/ServerContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import Server from "../Server/Server";
import axios from "axios";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away-subtle.css";
import { socket } from "../../IO";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "../Modal/Modal";
import HomeSkeleton from "../Skeletons/HomeSkeleton";
import InviteModal from "../Modal/InviteModal";

const Home = () => {
  // console.log(socket);
  const [servers, setServers] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [sliceCount, setSliceCount] = useState(-15);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [msgflag, setMsgflag] = useState(false);
  // const [photoURL, setPhotoURL] = useState("bg-[#2d2d47]");
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { serverInfo, setServerInfo } = useContext(ServerContext);
  const { channelInfo, setChannelInfo } = useContext(ChannelContext);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const { channelId, serverId } = useParams();
  const [channelIdState, setChannelIdState] = useState(channelId);
  const chatRef = useRef(null);
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  const navigate = useNavigate();
  onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      setDisplayName(currUser.displayName);
      // setPhotoURL(currUser.photoURL);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });
  const fetchProjects = async ({ pageParam = 5 }) => {
    console.log(`pageParam is: ${pageParam}`);
    console.log(`channelId is: ${channelId}`);
    const res = await fetch(
      `${backendURL}/msgapi/msgs/${channelId}?take=${pageParam}`
    );
    // console.log(`response ka pradarshan: `);
    // console.log(res);
    // return res.json().msgs;
    const msgs = await res.json();
    console.log("messages from fetchProjects: ");
    console.log(msgs);
    return msgs;
  };
  const fetchAllMsgs = async () => {
    setSliceCount(-15);
    setHasMore(true);
    const res = await fetch(`${backendURL}/msgapi/msgs/${channelId}`);
    const data = await res.json();
    localStorage.setItem("messages", JSON.stringify(data?.msgs));
    setDisplayMessages(data?.msgs.slice(-15));
  };
  const fetchNextMessages = () => {
    console.log("fetchNextMessages got triggered with slice value", sliceCount);
    const allMsg = JSON.parse(localStorage.getItem("messages"));
    let newMsgs = allMsg?.slice(sliceCount - 15, sliceCount);
    if (newMsgs.length === 0) {
      setHasMore(false);
    } else {
      let temp = [...newMsgs, ...displayMessages];
      setDisplayMessages(temp);
      setSliceCount(sliceCount - 15);
      let latestMsg = document.getElementById(12);
      // console.log("Latest msg is");
      // console.log(latestMsg);
      latestMsg.scrollIntoView({
        block: "start",
      });
    }
  };
  const fetchOneMessage = async (newChannelId) => {
    const res = await fetch(`${backendURL}/msgapi/msgs/${newChannelId}?take=1`);
    const data = await res.json();
    const allMsg = JSON.parse(localStorage.getItem("messages"));
    let newList = allMsg?.concat(data?.msgs);
    setDisplayMessages(newList?.slice(sliceCount));
    localStorage.setItem("messages", JSON.stringify(newList));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    setTimeout(() => {
      showServers();
      setServerInfo({
        ...serverInfo,
        serverId,
      });
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.removeItem("messages");
    // console.log("Current correct channelId", channelId);
    fetchAllMsgs();
  }, [channelId]);

  useEffect(() => {
    socket.on("received_message", (data) => {
      // console.log("Message received in channelId", data.channelId);
      fetchOneMessage(data.channelId);
    });
  }, []);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        message: currentMessage,
        author: displayName,
        channelId: channelId,
        timestamp: new Date().toISOString(),
      };
      socket.emit("send_message", messageData);
      const allMsg = JSON.parse(localStorage.getItem("messages"));
      let newList = allMsg?.concat(messageData);
      setDisplayMessages(newList?.slice(sliceCount));
      localStorage.setItem("messages", JSON.stringify(newList));
      setCurrentMessage("");
      scrollToBottom();
    }
  };

  const logoutUser = () => {
    const id = toast.loading("Logging out...");
    signOut(auth)
      .then(() => {
        console.log("signed out successfully...");
        console.log(isAuthenticated);
        toast.update(id, {
          render: "Logout successful..",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        setIsAuthenticated(false);
        localStorage.clear();
        navigate("/login");
      })
      .catch((e) => {
        toast.error("Some error occured", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        console.log(e.message);
      });
  };

  const showServers = async () => {
    try {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo);
      // if (userInfo) {
      const res = await axios.get(
        `${backendURL}/userapi/getserver/${userInfo?.userId}`
      );
      setServers(res.data?.joinedServers);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addServer = async () => {
    try {
      const serverName = prompt("Add the server name");
      if (serverName !== "") {
        const res = await axios.post(
          `${backendURL}/api/createserver`,
          JSON.stringify({
            Name: serverName,
          }),
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        showServers();
      }
      // const response = await res.json();
      // console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const setServer = (serverid, servername, servercode) => {
    setServerInfo({
      serverName: servername,
      serverId: serverid,
      serverCode: servercode,
    });
    setMsgflag(false);
    // localStorage.removeItem("messages");
    navigate(`/dashboard/${serverid}`);
  };

  const scrollToBottom = () => {
    chatRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  // Tooltip for profile pic
  tippy("#profile", {
    content: displayName,
    animation: "scale-extreme",
  });

  const showTippy = (serverId, serverName) => {
    tippy(`#s${serverId}`, {
      content: serverName,
      animation: "shift-away-subtle",
      placement: "right",
    });
  };

  // Modal functions
  const closeModal = () => {
    setShowModal(false);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
  };

  useEffect(() => {
    showServers();
  }, [showModal]);

  return (
    <>
      <div className="container h-screen">
        <div className="p-3 border border-gray-600  flex flex-col justify-center items-center h-full">
          <img src={brand_image} alt="chat-society" className="w-14 h-14" />
          <div className="flex  items-center flex-col overflow-y-scroll scrollbar-hide h-[70vh] my-3">
            {/* <button className="border-2 border-green-500 rounded w-10 h-10 ml-3">
                +
              </button> */}

            {!isLoading
              ? servers?.map((server, ind) => {
                  return (
                    <div
                      key={server.id}
                      className={`cursor-pointer p-3  transition-all ease-in-out rounded-full bg-slate-800 my-1 hover:bg-slate-700 ${
                        ind === 0 ? "mt-2" : null
                      }`}
                      onClick={() =>
                        setServer(server.id, server.Name, server.Code)
                      }
                      onMouseOver={() => showTippy(ind, server?.Name)}
                      id={"s" + ind}
                    >
                      {server.id === serverInfo.serverId ? (
                        <AiFillHome size={"1.5rem"} />
                      ) : (
                        <AiOutlineHome size={"1.5rem"} />
                      )}
                    </div>
                  );
                })
              : [1, 2, 3, 4, 5].map(() => {
                  return <HomeSkeleton />;
                })}
            <div
              className="my-5 p-3 bg-slate-800  rounded-full hover:text-blue-500 transition-all cursor-pointer duration-300 ease-in-out"
              onClick={() => setShowModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto flex justify-center flex-col items-center">
            {/* <p className="text-xs">{displayName}</p> */}
            <button
              onClick={logoutUser}
              data-background={"green"}
              className={`transition-all rounded-full p-2 bg-slate-800`}
              id="profile"
            >
              <ToastContainer />
              <FiUser size={"1.7rem"} />
            </button>
          </div>
        </div>
        <div>
          <Server serverName={serverInfo.serverName} setMsgflag={setMsgflag} />
        </div>
        <div className="chat-body w-full ">
          <div className="chat-body-header justify-between items-center h-fit pt-3 ">
            <div className="p-2 flex items-center">
              <p className="text-lg my-auto text-slate-200 ml-5">
                {channelInfo.channelName
                  ? "#  " + channelInfo.channelName
                  : "Select a chatroom"}
              </p>
              {/* <p
                className="ml-5 codeDiv rounded-lg p-2 text-slate-200 hover:text-blue-400 cursor-pointer"
                onClick={() => {
                  showCopyToast();
                  navigator.clipboard.writeText(serverInfo.serverCode);
                }}
              >
                Server Code: {serverInfo.serverCode}
              </p> */}
              <button
                className="flex text-slate-200 hover:text-blue-400 transition-all duration-200 ease-in-out codeDiv rounded-lg items-center px-3 py-1 ml-3"
                onClick={() => setShowInviteModal(true)}
              >
                <MdOutlinePersonAddAlt /> <p className="ml-3"> Invite</p>
              </button>
            </div>
            <div className="p-2 w-15">
              <input
                name="search"
                placeholder="    searching..."
                className="w-[30vh] rounded-lg bg-[#101018] p-2 outline-none"
              />
            </div>
          </div>
          {/* <p className="bg-[#2d2d47] border-2 border-transparent rounded-xl inline px-2">
                Join a channel to show chats
              </p> */}
          <div
            className="h-[70vh] mx-3 overflow-y-scroll flex flex-col-reverse"
            id="scrollableDiv"
          >
            {msgflag ? (
              <InfiniteScroll
                dataLength={displayMessages?.length}
                next={fetchNextMessages}
                datascrollableDivLength={displayMessages?.length}
                // style={{ display: "flex", flexDirection: "column-reverse" }}
                inverse={true}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                scrollThreshold={0.9}
              >
                {displayMessages?.map((messageData, i) => {
                  return (
                    <Fragment key={i}>
                      <div className="flex">
                        <div
                          className={`mt-2 bg-[#2d2d47] p-2 rounded-full h-fit`}
                        >
                          <FiUser size={"1.2rem"} />
                        </div>
                        <div
                          className={`messageCard flex flex-col border-2 border-[#16161e] rounded-r-[0.9rem] rounded-bl-[0.9rem] ${
                            displayName === messageData?.author
                              ? "bg-[#27273e]"
                              : "bg-[#1E1E30]"
                          } mt-2 p-2 w-fit`}
                          key={i}
                          id={i}
                        >
                          <div className="metaData text-[#c0caf5] pb-2 text-[0.7rem] flex justify-between items-center">
                            <div className="text-[1rem]">
                              {displayName === messageData?.author
                                ? "You"
                                : messageData?.author}
                            </div>
                            <div className="ml-3 mt-1 text-gray-300">
                              {new Date().toLocaleDateString() ===
                              new Date(
                                messageData?.timestamp
                              ).toLocaleDateString()
                                ? `Today at ${new Date(
                                    messageData?.timestamp
                                  ).toLocaleTimeString()}`
                                : `${new Date(
                                    messageData?.timestamp
                                  ).toLocaleDateString()} 
                          ${new Date(
                            messageData?.timestamp
                          ).toLocaleTimeString()}`}
                            </div>
                          </div>
                          <div className="message">{messageData?.message}</div>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
                <div className="pb-3" ref={chatRef} />
              </InfiniteScroll>
            ) : (
              <div className="flex justify-center items-center h-full w-full">
                <p className="text-gray-400">
                  Please select a chatroom to start chatting.
                </p>
              </div>
            )}
          </div>
          <div className="chat-footer p-4 text-lg flex-grow ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                value={currentMessage}
                // placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                // ref={inputReference}
                // onKeyPress={(event) => {
                //   event.key === "Enter" && sendMessage();
                // }}
                name="send-message"
                disabled={!msgflag}
                placeholder={
                  channelInfo.channelName
                    ? "Message #" + channelInfo.channelName
                    : "Select a channel"
                }
                className="send-message w-full rounded-lg py-2 px-3 bg-[#2d2d47] outline-none"
              />
              <input type="submit" hidden={true} />
            </form>
          </div>
        </div>
        <Modal
          showModal={showModal}
          closeModal={closeModal}
          variant="House"
          servers={servers}
        />
        <InviteModal
          showModal={showInviteModal}
          closeModal={closeInviteModal}
          Code={serverInfo.serverCode}
        />
      </div>
    </>
  );
};

export default Home;
