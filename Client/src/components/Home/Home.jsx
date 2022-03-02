import React, { useEffect, useState } from "react";
import "./Home.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  console.log(auth.currentUser);
  const [displayName, setDisplayName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      setDisplayName(currUser.displayName);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  });
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

  return (
    <>
      <div className="container w-full">
        <div className="server p-3 border-2 border-white flex flex-col">
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
          <hr className="bg-gray-600" />
          <div className="createServer">
            {/* <button className="border-2 border-green-500 rounded w-10 h-10 ml-3">
              +
            </button> */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 my-5 bg-slate-700 hover:rounded-xl hover:text-blue-500 transition-all cursor-pointer"
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

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 my-5 bg-slate-700 hover:rounded-xl hover:text-blue-500 transition-all cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              />
            </svg>
          </div>
          <div className="mt-auto flex justify-center flex-col items-center">
            <p className="text-xs">{displayName}</p>
            <button
              onClick={logoutUser}
              className="hover:text-blue-500 transition-all"
            >
              <ToastContainer />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="channels p-2 border-2 border-transparent rounded-tl-2xl h-full">
          <div className="text-center border-b-2 border-[#26263d] mt-2">
            <h1>channels</h1>
          </div>
        </div>
        <div className="chat-body">
          <div className="chat-body-header">
            <div className="">
              <p className="p-5">Channel Name</p>
            </div>
            <div className="p-2 w-15 mt-2">
              <input
                name="search"
                placeholder="    searching..."
                className="w-[30vh]  rounded-lg bg-[#101018] p-2"
              />
            </div>
          </div>
          <div className="chat-display text-center justify-item-center my-auto">
            {/* <p className="bg-[#2d2d47] border-2 border-transparent rounded-xl inline px-2">
              Join a channel to show chats
            </p> */}
          </div>
          <div className="chat-footer p-4 text-lg">
            <input
              name="send-message"
              placeholder="  send you first message..."
              className="send-message w-full rounded-lg pl-5 bg-[#2d2d47] outline-none"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
