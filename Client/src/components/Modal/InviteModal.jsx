import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "./Modal.css";

const InviteModal = ({ showModal, closeModal, Code }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      closeModal();
    }
  };
  // Copy toast
  const showCopyToast = () => {
    toast("Code copied successfully!", {
      theme: "dark",
      type: "info",
      closeButton: false,
      closeOnClick: true,
      position: "top-right",
    });
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
          <p className="font-semibold text-xl text-slate-300">
            Add People to your house!
          </p>
          <AiOutlineCloseCircle
            size={"1.5rem"}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        {Code ? (
          <div className="flex flex-col justify-evenly items-center p-2 text-gray-300">
            <p className="my-2">Share this invite code with your friends!</p>

            <p
              onClick={() => {
                showCopyToast();
                navigator.clipboard.writeText(Code);
              }}
              className="codeP px-3 py-1 text-slate-300 text-lg hover:text-sky-400 cursor-pointer rounded-xl my-3"
            >
              {Code}
            </p>
            <p className="my-2 text-slate-400">Click to copy!</p>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-red-400/90 my-4 bg-red-900/40 px-3 py-1 rounded-lg">
              Please select a home!
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default InviteModal;
