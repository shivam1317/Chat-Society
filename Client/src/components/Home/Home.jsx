import React, { Fragment, useEffect, useState, useRef } from "react";
import "./Home.css";
import brand_image from "../../../public/images/index/brand_icon.png";
import { FiUser } from "react-icons/fi";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { ChannelContext } from "../Contexts/ChannelContext";
import { ServerContext } from "../Contexts/ServerContext";
import Server from "../Server/Server";
import axios from "axios";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away-subtle.css";
import { socket } from "../../IO";
import InfiniteScroll from "react-infinite-scroll-component";

// === modal imports ===
import Modal from "../Modal/Modal";
import HomeSkeleton from "../Skeletons/HomeSkeleton";
import InviteModal from "../Modal/InviteModal";
import ImagePreview from "../Modal/ImagePreview";

import MessageSkeleton from "../Skeletons/MessageSkeleton";
import { storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid"; // to make the image filename unique
import Resizer from "react-image-file-resizer";

const Home = () => {
  // Refs
  const usrimg = useRef(null);
  const chatRef = useRef(null);
  // Local states
  const [previewImage, setPreviewImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [servers, setServers] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [sliceCount, setSliceCount] = useState(-15);
  // Loaders
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgflag, setMsgflag] = useState(false);
  // const [photoURL, setPhotoURL] = useState("bg-[#2d2d47]");
  const [displayName, setDisplayName] = useState("");
  // Modal States
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  // Context API states
  let { serverInfo, setServerInfo } = useContext(ServerContext);
  let { channelInfo, setChannelInfo } = useContext(ChannelContext);
  // Params
  let { channelId, serverId } = useParams();
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  const navigate = useNavigate();
  onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      // setPhotoURL(currUser.photoURL);
      setDisplayName(auth.currentUser.displayName);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });

  useEffect(() => {
    setTimeout(() => {
      const u = JSON.parse(localStorage.getItem("userInfo"));
      // Check if userInfo is present in localStorage or not
      if (u) {
        setUserInfo(u);
      } else {
        signOut(auth)
          .then(() => {
            localStorage.clear();
            navigate("/login");
          })
          .catch((e) => {
            console.log(e.message);
          });
      }
    }, 500);
  }, []);

  const fetchAllMsgs = async () => {
    setSliceCount(-15);
    setHasMore(true);
    const res = await fetch(`${backendURL}/msgapi/msgs/${channelId}`);
    const data = await res.json();
    localStorage.setItem("messages", JSON.stringify(data?.msgs));
    setDisplayMessages(data?.msgs?.slice(-15));
    setMsgLoading(false);
  };
  const fetchNextMessages = () => {
    const allMsg = JSON.parse(localStorage.getItem("messages"));
    let newMsgs = allMsg?.slice(sliceCount - 15, sliceCount);
    if (newMsgs.length === 0) {
      setHasMore(false);
    } else {
      let temp = [...newMsgs, ...displayMessages];
      setDisplayMessages(temp);
      setSliceCount(sliceCount - 15);
      let latestMsg = document.getElementById(12);
      latestMsg.scrollIntoView({
        block: "start",
      });
    }
  };
  const fetchOneMessage = async (newChannelId) => {
    const currChan = JSON.parse(localStorage.getItem("currChan"));
    if (currChan === newChannelId) {
      const res = await fetch(
        `${backendURL}/msgapi/msgs/${newChannelId}?take=1`
      );
      const data = await res.json();
      const allMsg = JSON.parse(localStorage.getItem("messages"));
      let newList = allMsg?.concat(data?.msgs);
      setDisplayMessages(newList?.slice(sliceCount));
      localStorage.setItem("messages", JSON.stringify(newList));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    setTimeout(() => {
      setServerInfo({
        ...serverInfo,
        serverId,
      });
      showServers();
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.removeItem("messages");
    localStorage.setItem("currChan", JSON.stringify(channelId));
    fetchAllMsgs();
  }, [channelId]);

  useEffect(() => {
    socket.on("received_message", (data) => {
      fetchOneMessage(data.channelId);
    });
  }, []);

  //=== image compression ===
  // resize the image and return the base64uri
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        400,
        "WEBP",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  // === image compression ===

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData = {
        message: currentMessage,
        author: userInfo.userName,
        authorId: userInfo.userId,
        channelId: channelId,
        api_secret: import.meta.env.VITE_APP_API_SECRET,
        timestamp: new Date().toISOString(),
        type: "text",
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

  const showServers = async () => {
    try {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.get(
        `${backendURL}/userapi/getserver/${userInfo?.userId}`
      );
      setServers(res.data?.joinedServers);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const setServer = (serverid, servername, servercode, ownerId) => {
    setServerInfo({
      serverName: servername,
      serverId: serverid,
      serverOwnerId: ownerId,
      serverCode: servercode,
    });
    setMsgflag(false);
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

  // Modal functions
  const closeModal = () => {
    setShowModal(false);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
  };

  const closeImagePreviewModal = () => {
    setShowImagePreviewModal(false);
    setPreviewImage(null);
    usrimg.current.value = null;
  };

  useEffect(() => {
    showServers();
  }, [showModal]);

  const OnProfileBtnClick = () => {
    navigate(`/profile/${userInfo.userId}`);
  };

  const onMsgClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  const updateImage = (image) => {
    if (image !== "") {
      const imageRef = ref(storage, `/Images/${image.name + v4()}`);
      const uploadTask = uploadBytesResumable(imageRef, image);
      const id = toast.loading("Uploading image..");
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // const progress = parseInt(
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // );
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const messageData = {
              message: downloadURL,
              author: userInfo.userName,
              authorId: userInfo.userId,
              channelId: channelId,
              api_secret: import.meta.env.VITE_APP_API_SECRET,
              timestamp: new Date().toISOString(),
              type: "image",
            };
            socket.emit("send_message", messageData);
            const allMsg = JSON.parse(localStorage.getItem("messages"));
            let newList = allMsg?.concat(messageData);
            setDisplayMessages(newList?.slice(sliceCount));
            toast.update(id, {
              render: "upload successful",
              type: "success",
              isLoading: false,
              autoClose: 2000,
              closeOnClick: true,
            });
            localStorage.setItem("messages", JSON.stringify(newList));
            scrollToBottom();
          });
        }
      );
    }
  };
  return (
    <>
      <div className="container1 h-[97vh] scrollbar-hide">
        <div className="p-3 border border-gray-600  flex flex-col justify-center items-center h-full">
          <img src={brand_image} alt="chat-society" className="w-14 h-14" />
          <div className="flex  items-center flex-col overflow-y-scroll scrollbar-hide h-[70vh] my-3">
            {!isLoading
              ? servers?.map((server, ind) => {
                  return (
                    <div
                      key={server.id}
                      className={`cursor-pointer p-3  transition-all ease-in-out rounded-full bg-slate-800 my-1 hover:bg-slate-700 ${
                        ind === 0 ? "mt-2" : null
                      }`}
                      onClick={() =>
                        setServer(
                          server.id,
                          server.Name,
                          server.Code,
                          server.ownerId
                        )
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
              : [1, 2, 3, 4, 5].map((e) => {
                  return <HomeSkeleton key={e} />;
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
            <button
              onClick={OnProfileBtnClick}
              className={`transition-all rounded-full p-2 bg-slate-800`}
            >
              <ToastContainer />
              <FiUser size={"1.7rem"} />
            </button>
          </div>
        </div>
        <div>
          <Server
            serverName={serverInfo.serverName}
            setMsgflag={setMsgflag}
            setMsgLoading={setMsgLoading}
          />
        </div>
        <div className="chat-body w-full">
          <div className="chat-body-header justify-between items-center h-fit pt-3">
            <div className="p-2 flex items-center mb-2">
              <p className="text-lg my-auto text-slate-200 ml-5">
                {channelInfo.channelName
                  ? "#  " + channelInfo.channelName
                  : "Select a chatroom"}
              </p>
              <button
                className="flex text-slate-200 hover:text-blue-400 transition-all duration-200 ease-in-out codeDiv rounded-lg items-center px-3 py-1 ml-3"
                onClick={() => setShowInviteModal(true)}
              >
                <MdOutlinePersonAddAlt /> <p className="ml-3"> Invite</p>
              </button>
            </div>
            <div className="p-2 mb-1">
              <a
                href="https://github.com/shivam1317/Chat-Society/wiki"
                className="codeDiv px-3 py-2 text-slate-300 hover:text-blue-400 transition-all duration-200 ease-in-out rounded-xl"
                target={"_blank"}
              >
                Need Help?
              </a>
            </div>
          </div>
          <div
            className="h-[70vh] mx-3 overflow-y-scroll flex flex-col-reverse"
            id="scrollableDiv"
          >
            {msgLoading ? (
              [1, 2, 3, 4, 5].map((e) => {
                return <MessageSkeleton key={e} />;
              })
            ) : msgflag ? (
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
                          className={`mt-2 bg-[#2d2d47] p-2 rounded-full h-fit cursor-pointer`}
                          onClick={() => onMsgClick(messageData.authorId)}
                        >
                          <FiUser size={"1.2rem"} />
                        </div>
                        <div
                          className={`messageCard flex flex-col border-2 border-[#16161e] rounded-r-[0.9rem] rounded-bl-[0.9rem] ${
                            userInfo.userName === messageData?.author
                              ? "bg-[#27273e]"
                              : "bg-[#1E1E30]"
                          } mt-2 p-2 w-fit`}
                          key={i}
                          id={i}
                        >
                          <div className="metaData text-[#c0caf5] pb-2 text-[0.7rem] flex justify-between items-center">
                            <div className="text-[1rem]">
                              {userInfo.userName === messageData?.author
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
                          {messageData.type === "text" ? (
                            <div className="message overflow-hidden break-all">
                              {messageData?.message}
                            </div>
                          ) : (
                            <img
                              width={350}
                              height={200}
                              src={messageData?.message}
                              className="p-1"
                            />
                          )}
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
          <div className="chat-footer my-auto text-lg flex-grow flex-row">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <div className="flex flex-row">
                <div className="mx-2">
                  <input
                    id="actual-btn"
                    type="file"
                    accept="image/png, image/gif, image/jpeg, image/webp"
                    ref={usrimg}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      const fileSize = parseFloat(
                        file.size / (1024 * 1024)
                      ).toFixed(0);
                      if (fileSize < 4 || file.type === "image/gif") {
                        setPreviewImage(file);
                        setShowImagePreviewModal(true);
                      } else {
                        const resizedImage = await resizeFile(file);
                        setPreviewImage(resizedImage);
                        setShowImagePreviewModal(true);
                      }
                    }}
                    disabled={!msgflag}
                    hidden
                  />
                  <label htmlFor="actual-btn">
                    <div className="mt-auto p-2 bg-[#2d2d47]  rounded-full hover:text-blue-500 transition-all cursor-pointer duration-300 ease-in-out">
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
                  </label>
                </div>
                <input
                  type="text"
                  value={currentMessage}
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
                  className="send-message mt-auto mx-2 w-full h-1/2 rounded-lg py-2 px-3 bg-[#2d2d47] outline-none"
                />
                <input type="submit" hidden={true} />
              </div>
            </form>
          </div>
        </div>
        {/* Modals */}
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
        <ImagePreview
          showModal={showImagePreviewModal}
          closeModal={closeImagePreviewModal}
          previewImage={previewImage}
          setImage={updateImage}
        />
      </div>
    </>
  );
};

export default Home;
