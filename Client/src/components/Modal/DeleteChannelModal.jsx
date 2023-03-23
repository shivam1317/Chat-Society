import { AiOutlineCloseCircle } from "react-icons/ai";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { CiWarning } from "react-icons/ci";
import "./Modal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_APP_BACKEND_URL;

const DeleteChannelModal = ({
  showDeleteChannelModal,
  data,
  setChannelInfo,
  setMsgFlag,
  closeDeleteChannelModal,
}) => {
  const navigate = useNavigate();
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      closeDeleteChannelModal();
    }
  };
  const handleDeleteChannel = async () => {
    try {
      const res = await axios.post(
        backendURL + "/channelapi/deletechannel",
        data
      );
      if (data.channelId === data.currChannelId) {
        setChannelInfo({
          channelId: null,
          channelName: null,
        });
        setMsgFlag(false);
        navigate(`/dashboard/${data.serverId}/`);
      }
    } catch (e) {
      console.log(e);
    }
    closeDeleteChannelModal();
  };

  if (!showDeleteChannelModal) {
    return null;
  }
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        id="container"
        onClick={handleOnClose}
      >
        <div className="w-[40%] p-2 bg-[#202036] rounded-lg">
          <div className="flex justify-between items-center w-full px-5 py-2">
            <p className="font-semibold text-xl text-slate-300 flex justify-center items-center">
              <CiWarning className="text-red-500 text-3xl mr-3" /> Do you want
              to delete this room?
            </p>
            <AiOutlineCloseCircle
              size={"1.5rem"}
              className="cursor-pointer"
              onClick={closeDeleteChannelModal}
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="p-2 flex bg-slate-800 rounded-lg w-[25%] justify-center items-center text-gray-300 my-3">
              <HiOutlineChatAlt2 size={"1.1rem"} className="mr-2 mt-1" />
              <p>{data.channelName}</p>
            </div>
            <div className="w-[90%] flex justify-evenly my-3">
              <button
                className="codeDiv px-2 py-1 rounded-lg w-[35%] my-2 hover:text-blue-500 transition-all ease-in-out duration-200"
                onClick={closeDeleteChannelModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-900/30 text-red-500 px-2 py-1 rounded  hover:bg-red-900/40 w-[35%] my-2"
                onClick={handleDeleteChannel}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteChannelModal;
