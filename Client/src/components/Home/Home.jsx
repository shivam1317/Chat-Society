import React from "react";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="server p-5">
          <div className="createServer">
            {/* <button className="border-2 border-green-500 rounded w-10 h-10 ml-3">
              +
            </button> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
        <div className="channels p-2 border-2 border-transparent rounded-tl-2xl">
          <div className="text-center border-b-2 border-[#26263d] mt-2">
            <h1>channels</h1>
          </div>
        </div>
        <div className="chat-body">
          <div className="chat-body-header">
            <div className="">
              <p className="p-5">Channel Name</p>
            </div>
            <div className="p-4 w-15 ">
              <input
                name="search"
                placeholder="    searching..."
                className="w-[30vh]  rounded-lg bg-[#101018]"
              />
            </div>
          </div>
          <div className="chat-display text-center justify-item-center mt-[25%]">
            Join channel to show chats
          </div>
          <div className="chat-footer">
            <div className="p-5">
              <input
                name="send-message"
                placeholder="  send you first message..."
                className="send-message w-[100%] rounded-lg bg-[#2d2d47]"
              />
            </div>
            <div className="p-5">
              <button className="bg-green-600 rounded w-16">send</button>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Home;
