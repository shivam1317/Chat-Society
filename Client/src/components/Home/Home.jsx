import React, { Fragment, useEffect, useState, useRef } from "react";
import "./Home.css";
import { FiUser } from "react-icons/fi";
import { TfiHome } from "react-icons/tfi";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
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

const Home = () => {
  const [servers, setServers] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [sliceCount, setSliceCount] = useState(-15);
  const [hasMore, setHasMore] = useState(true);
  const [displayName, setDisplayName] = useState("");
  // const [bgColor, setBgColor] = useState("bg-[#2d2d47]");
  const [showModal, setShowModal] = useState(false);
  const { serverInfo, setServerInfo } = useContext(ServerContext);
  const { channelInfo, setChannelInfo } = useContext(ChannelContext);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const { channelId } = useParams();
  const [channelIdState, setChannelIdState] = useState(channelId);
  const chatRef = useRef(null);

  const navigate = useNavigate();
  onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      setDisplayName(currUser.displayName);
      // setBgColor(currUser.bgColor);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });
  const fetchProjects = async ({ pageParam = 5 }) => {
    console.log(`pageParam is: ${pageParam}`);
    console.log(`channelId is: ${channelId}`);
    const res = await fetch(
      `http://localhost:5000/msgapi/msgs/${channelId}?take=${pageParam}`
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
    const res = await fetch(`http://localhost:5000/msgapi/msgs/${channelId}`);
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
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const fetchOneMessage = async (newChannelId) => {
    const res = await fetch(
      `http://localhost:5000/msgapi/msgs/${newChannelId}?take=1`
    );
    const data = await res.json();
    const allMsg = JSON.parse(localStorage.getItem("messages"));
    let newList = allMsg?.concat(data?.msgs);
    setDisplayMessages(newList?.slice(sliceCount));
    localStorage.setItem("messages", JSON.stringify(newList));
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [`messages`],
    queryFn: fetchProjects,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.next;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    showServers();
  }, []);

  useEffect(() => {
    localStorage.clear();
    scrollToBottom();
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
      };
      socket.emit("send_message", messageData);
      setCurrentMessage("");
      scrollToBottom();
    }
  };
  // Get random colors using : colors[Math.floor(Math.random()*colors.length)]
  // const colors = [
  //   "bg-[#2d2d47]",
  //   "bg-[#E94560]",
  //   "bg-[#1F4068]",
  //   "bg-[#1597BB]",
  //   "bg-[#4A47A3]",
  //   "bg-[#29A19C]",
  //   "bg-[#EC9B3B]",
  // ];

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
      const res = await axios.get("http://localhost:5000/api/getserver");
      // console.log("servers are ", res);
      setServers(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addServer = async () => {
    try {
      const serverName = prompt("Add the server name");
      if (serverName !== "") {
        const res = await axios.post(
          "http://localhost:5000/api/createserver",
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

  const setServer = (serverid, servername) => {
    setServerInfo({
      serverName: servername,
      serverId: serverid,
    });
    navigate(`/dashboard/${serverid}`);
  };

  const scrollToBottom = () => {
    chatRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const showTippy = (serverId, serverName) => {
    tippy(`#s${serverId}`, {
      content: serverName,
      animation: "shift-away-subtle",
      placement: "right",
    });
  };
  // Tooltip for profile pic
  tippy("#profile", {
    content: displayName,
    animation: "scale-extreme",
  });

  // Modal functions
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    showServers();
  }, [showModal]);

  return (
    <>
      <div className="container w-full">
        <div className="server p-3 border border-gray-600 flex flex-col justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-5  text-blue-500 transition-all cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <hr className=" border-1 border-gray-700 w-full" />
          <div className="flex justify-center items-center flex-col overflow-y-scroll scrollbar-hide">
            {/* <button className="border-2 border-green-500 rounded w-10 h-10 ml-3">
                +
              </button> */}

            {servers?.map((server, ind) => {
              return (
                <div
                  key={server.id}
                  className="flex flex-col cursor-pointer p-3 transition-all ease-in-out rounded-full bg-slate-800 my-1 hover:bg-slate-600"
                  onClick={() => setServer(server.id, server.Name)}
                  onMouseOver={() => showTippy(ind, server?.Name)}
                  id={"s" + ind}
                >
                  {/* <p>{server.Name}</p> */}
                  <TfiHome size={"1.5rem"} />
                </div>
              );
            })}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 my-5 bg-slate-700 hover:rounded-xl hover:text-blue-500 transition-all cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => setShowModal(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div className="mt-auto flex justify-center flex-col items-center">
            {/* <p className="text-xs">{displayName}</p> */}
            <button
              onClick={logoutUser}
              data-background={"green"}
              className={`transition-all rounded-full p-3 bg-[#2d2d47]`}
              id="profile"
            >
              <ToastContainer />
              {/* <img src={photoURL} alt="profile" id="profile" /> */}
              <FiUser size={"1.7rem"} />
            </button>
          </div>
        </div>
        <div>
          <Server serverName={serverInfo.serverName} />
        </div>
        <div className="chat-body">
          <div className="chat-body-header flex-grow justify-between">
            <div className="">
              {/* <p className="p-5">
                  {channelInfo.channelName
                    ? channelInfo.channelName
                    : "ChannelName"}
                </p> */}
            </div>
            <div className="p-2 w-15 mt-2">
              <input
                name="search"
                placeholder="    searching..."
                className="w-[30vh]  rounded-lg bg-[#101018] p-2"
              />
            </div>
          </div>
          {/* <p className="bg-[#2d2d47] border-2 border-transparent rounded-xl inline px-2">
                Join a channel to show chats
              </p> */}
          <div
            className="h-[80vh] mx-3 overflow-y-scroll flex flex-col-reverse"
            id="scrollableDiv"
          >
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
                        {/* {auth.currentUser.photoURL ? (
                          <img src={auth.currentUser.photoURL} />
                        ) : (
                          <FiUser size={"1.2rem"} />
                        )} */}

                        <FiUser size={"1.2rem"} />
                      </div>
                      <div
                        className={`messageCard flex flex-col border-2 border-[#16161e] rounded-r-[0.9rem] rounded-bl-[0.9rem] ${
                          displayName === messageData?.author
                            ? "bg-[#27273e]"
                            : "bg-[#1E1E30]"
                        } mt-2 p-2 w-fit`}
                        key={messageData?.id}
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
                // disabled={!channelInfo.channelId}
                placeholder={
                  channelInfo.channelName
                    ? "Message #" + channelInfo.channelName
                    : "Select a channel"
                }
                className="send-message w-full rounded-lg pl-5 bg-[#2d2d47] outline-none"
              />
              <input type="submit" hidden={true} />
            </form>
          </div>
        </div>
        <Modal showModal={showModal} closeModal={closeModal} variant="House" />
      </div>
    </>
  );
};

export default Home;
