import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase-config";
import Channel from "../Channel/Channel";
import "../Home/Home.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale-extreme.css";

const Server = ({ serverName }) => {
  const [channels] = useCollection(collection(db, serverName));
  const addChannel = async () => {
    try {
      const userInput = prompt("Enter channel name");
      if (userInput) {
        const Doc = await addDoc(collection(db, serverName), {
          channelName: userInput,
        });
        console.log("Document written with ID: ", Doc.id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
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
        {channels?.docs.map((doc) => (
          <Channel
            id={doc.id}
            channelName={doc.data().channelName}
            key={doc.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Server;
