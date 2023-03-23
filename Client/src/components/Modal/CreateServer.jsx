import React, { useRef, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BsFillDoorClosedFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { ServerContext } from "../Contexts/ServerContext";
import axios from "axios";
const backendURL = import.meta.env.VITE_APP_BACKEND_URL;

const CreateServer = ({ variant, closeModal }) => {
  const houseRef = useRef(null);
  const { serverInfo } = useContext(ServerContext);
  const serverId = serverInfo.serverId;
  const submitData = async () => {
    const id = toast.loading("Hold up...");
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const housename = houseRef?.current?.value;
      if (housename && variant === "House") {
        const res = await axios.post(backendURL + "/api/createserver", {
          Name: housename,
          ownerId: userInfo.userId,
          api_secret: import.meta.env.VITE_APP_API_SECRET,
        });
        closeModal();
        toast.update(id, {
          render: "House created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: "dark",
        });
      } else if (housename && variant === "Room") {
        await axios.post(`${backendURL}/channelapi/createchannel`, {
          channelName: housename,
          serverId,
          ownerId: userInfo.userId,
          api_secret: import.meta.env.VITE_APP_API_SECRET,
        });
        closeModal();
        toast.update(id, {
          render: "Chatroom created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.update(id, {
        render: "Some Error Occured!",
        theme: "dark",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };
  return (
    <>
      <div className="flex flex-col p-3 ml-3">
        <label
          htmlFor="name"
          className="w-fit my-1 text-gray-300 flex items-center"
        >
          {variant === "House" ? (
            <AiFillHome size={"1.2rem"} className="text-indigo-300" />
          ) : (
            <BsFillDoorClosedFill size={"1.2rem"} className="text-indigo-300" />
          )}
          <p className="mx-2">{variant} Name</p>
        </label>
        <input
          type={"text"}
          id="name"
          className="w-full outline-none bg-[#282844] border-none rounded  focus:ring-2 focus:ring-indigo-400 text-base px-3 leading-8 transition-colors duration-200 ease-in-out my-2 text-gray-200"
          name="housename"
          ref={houseRef}
        />
      </div>

      <div className="flex justify-center items-center w-full">
        <button
          className="bg-indigo-500 text-gray-200 px-2 py-1 rounded  hover:bg-indigo-400 w-[40%] my-2"
          onClick={submitData}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateServer;
