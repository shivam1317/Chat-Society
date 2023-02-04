import React, { useRef, useContext } from "react";
import { BsJournalCode } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
const backendURL = import.meta.env.VITE_APP_BACKEND_URL;

const AddServer = ({ closeModal, servers }) => {
  const codeRef = useRef(null);
  const submitData = async () => {
    const id = toast.loading("Hold up...");
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const code = codeRef?.current?.value;
      if (code) {
        let presentCode = servers.filter((server) => server["Code"] === code);
        if (presentCode.length > 0) {
          toast.update(id, {
            render: "You have already joined this server!",
            isLoading: false,
            type: "info",
            theme: "dark",
            closeOnClick: true,
            autoClose: 2000,
          });
        } else {
          const response = await axios.post(backendURL + "/api/joinserver", {
            Code: code,
            userId: userInfo.userId,
          });
          closeModal();
          toast.update(id, {
            render: "You successfully joined the house!",
            type: "info",
            isLoading: false,
            autoClose: 2000,
            closeOnClick: true,
            theme: "dark",
          });
        }
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
      <div className="p-3 ml-3">
        <label className="flex items-center w-fit text-gray-300" htmlFor="code">
          <BsJournalCode className="text-indigo-300" />{" "}
          <p className="ml-3">Add the invite code below</p>
        </label>
        <input
          type={"text"}
          id="code"
          className="w-full outline-none bg-[#282844] border-none rounded  focus:ring-2 focus:ring-indigo-400 text-base px-3 leading-8 transition-colors duration-200 ease-in-out my-2 text-gray-200"
          name="code"
          ref={codeRef}
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

export default AddServer;
