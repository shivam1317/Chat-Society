import axios from "axios";
import React, { useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
const backendURL = import.meta.env.VITE_APP_BACKEND_URL;

const Updateuser = ({ showModal, closeModal }) => {
  const newName = useRef(null);
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      closeModal();
    }
  };
  if (!showModal) {
    return null;
  }
  const updateUser = async () => {
    const id = toast.loading("Hold up...");
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const name = newName?.current?.value;
      if (!name) {
        toast.update(id, {
          render: "New name can't be empty!",
          theme: "dark",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          closeOnClick: true,
        });
      } else {
        // update user in localStorage state
        const newuser = {
          userId: userInfo.userId,
          userName: name,
        };
        localStorage.setItem("userInfo", JSON.stringify(newuser));
        // update user in DB
        let res = await axios.put(backendURL + "/userapi/updateuser", {
          id: userInfo.userId,
          Name: name,
          api_secret: import.meta.env.VITE_APP_API_SECRET,
        });
        closeModal();
        toast.update(id, {
          render: "Username updated successfully!",
          theme: "dark",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeOnClick: true,
        });
      }
    } catch (e) {
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
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="w-[40%] p-2 bg-[#202036] rounded-lg">
        <div className="flex justify-between items-center w-full px-5 py-2">
          <p className="font-semibold text-xl text-slate-300">
            Update a username
          </p>
          <AiOutlineCloseCircle
            size={"1.5rem"}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <form className="w-full px-4 py-6 flex flex-col items-center">
          <label htmlFor="newuser" className="text-gray-400 w-full">
            Enter your new username:
          </label>
          <input
            type={"text"}
            id="newuser"
            className="w-full outline-none bg-[#282844] border-none rounded  focus:ring-1 focus:ring-indigo-400 text-base px-3 leading-8 transition-colors duration-200 ease-in-out my-3 text-gray-300"
            name="newuser"
            ref={newName}
          />
          <button
            className="bg-indigo-500/80 text-gray-200 px-2 py-1 rounded  hover:bg-indigo-500/90 w-[40%] my-2"
            onClick={updateUser}
          >
            Update
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Updateuser;
