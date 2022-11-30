import React, { Fragment, useEffect, useState } from "react";
import "./Home.css";
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
import "tippy.js/animations/scale-extreme.css";
import { socket } from "../../IO";

const Home = () => {
  // console.log(socket);
  const [servers, setServers] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("#");
  const { serverInfo, setServerInfo } = useContext(ServerContext);
  const { channelInfo, setChannelInfo } = useContext(ChannelContext);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const { channelId } = useParams();

  const navigate = useNavigate();
  onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      setDisplayName(currUser.displayName);
      setPhotoURL(currUser.photoURL);
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
    console.log(`response ka pradarshan: `);
    console.log(res);
    // return res.json().msgs;
    const msgs = await res.json();
    console.log("messages : ");
    console.log(msgs);
    return msgs;
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
      console.log(lastPage);
      return lastPage?.next;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: channelId !== undefined,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    showServers();
    fetchProjects({ pageParam: 0 });
  }, []);

  useEffect(() => {
    refetch();
  }, [channelId]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        message: currentMessage,
        author: displayName,
        channelId: channelId,
      };
      socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
    socket.on("received_message", (data) => {
      // alert(data.data);
      refetch();
    });
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

  // const redirect = () =>{
  //     navigate("/profile")
  // }
  const setServer = (serverid, servername) => {
    setServerInfo({
      serverName: servername,
      serverId: serverid,
    });
    navigate(`/dashboard/${serverid}`);
  };
  // Tooltip for profile pic
  tippy("#profile", {
    content: displayName,
    animation: "scale-extreme",
  });

  return (
    <>
      <div className="container w-full">
        <div className="server p-3 border-2 border-white flex flex-col justify-center items-center">
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

            {servers?.map((server) => {
              return (
                <div
                  key={server.id}
                  className="flex flex-col cursor-pointer p-1 hover:bg-slate-800 transition-all ease-in-out rounded-lg"
                  onClick={() => setServer(server.id, server.Name)}
                >
                  <p>{server.Name}</p>
                </div>
              );
            })}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 my-5 bg-slate-700 hover:rounded-xl hover:text-blue-500 transition-all cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={addServer}
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
              onClick={() => navigate("/profile")}
              className="hover:text-blue-500 transition-all"
            >
              <ToastContainer />
              <img src={photoURL} alt="profile" id="profile" />
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
          <div className="chat-display">
            {/* <p className="bg-[#2d2d47] border-2 border-transparent rounded-xl inline px-2">
                Join a channel to show chats
              </p> */}
            <div className="chat-body mx-3 my-3 overflow-y-scroll">
              {data?.pages.map((group, i) => {
                {
                  console.log("tis iz gurup");
                  console.log(group);
                }
                return (
                  <Fragment key={i}>
                    {group?.msgs?.map((messageData) => {
                      {
                        console.log("dis ij messageData");
                        console.log(messageData);
                        // console.log(`current channel: ${channelId} | messageChannel: ${messageData.channelId}`)
                      }
                      return (
                        channelId === messageData.channelId && (
                          <div
                            className="messageCard flex flex-col"
                            key={messageData.id}
                          >
                            <div className="metaData">{messageData.author}</div>
                            <div className="message">{messageData.message}</div>
                          </div>
                        )
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
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
                placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                // onKeyPress={(event) => {
                //   event.key === "Enter" && sendMessage();
                // }}
                name="send-message"
                // disabled={!channelInfo.channelId}
                // placeholder={
                //   channelInfo.channelName
                //     ? "Message #" + channelInfo.channelName
                //     : "Select a channel"
                // }
                className="send-message w-full rounded-lg pl-5 bg-[#2d2d47] outline-none"
              />
              <input type="submit" hidden={true} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
