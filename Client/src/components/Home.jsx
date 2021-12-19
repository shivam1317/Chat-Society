import React from "react";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="server p-5">
          <p>servers</p>
        </div>
        <div className="channels p-2">
          <p>channels</p>
        </div>
        <div className="chat-body">
          <div className="chat-body-header">
            <div className="">Channel Name</div>
            <div className="p-4 w-15 ">
              <input
                name="search"
                placeholder="    searching..."
                className="w-[30vh]  rounded-lg"
              />
            </div>
          </div>
          <div className="chat-display">Join channel to show chats</div>
          <div className="chat-footer">
            <div className="p-5">
              <input
                name="send-message"
                placeholder="  send you first message..."
                className="send-message w-[100%] rounded-lg"
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
