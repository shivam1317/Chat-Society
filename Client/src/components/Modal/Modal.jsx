import React, { useState } from "react";
import { AiOutlineCloseCircle, AiOutlineHome } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import CreateServer from "./CreateServer";
import AddServer from "./AddServer";
import "./Modal.css";

const Modal = ({ showModal, closeModal, variant, servers }) => {
  const [flag, setFlag] = useState(true);
  // Closing the modal on clicking outside the container
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      closeModal();
    }
  };

  if (!showModal) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="w-[40%] p-2 bg-[#202036] rounded-lg">
        <div className="flex justify-between items-center w-full px-5 py-2">
          <p className="font-semibold text-2xl text-slate-300">
            Add a {variant}
          </p>
          <AiOutlineCloseCircle
            size={"1.5rem"}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        {variant === "House" ? (
          <div className="mx-auto flex justify-evenly items-center mt-4 mb-3 text-gray-300">
            <button
              onClick={() => setFlag(true)}
              className={`flex px-3 py-1 justify-evenly items-center  tabBtn rounded-lg mx-1 ${
                flag ? "text-indigo-400" : null
              }`}
            >
              <IoIosAddCircleOutline /> <p className="ml-2">Create A House</p>
            </button>
            <button
              onClick={() => setFlag(false)}
              className={`flex px-3 py-1 justify-evenly items-center  tabBtn rounded-lg mx-1 ${
                !flag ? "text-indigo-400" : null
              }`}
            >
              <AiOutlineHome /> <p className="ml-2">Join an existing House</p>
            </button>
          </div>
        ) : null}
        {flag ? (
          <CreateServer closeModal={closeModal} variant={variant} />
        ) : (
          <AddServer closeModal={closeModal} servers={servers} />
        )}
      </div>
    </div>
  );
};

export default Modal;
