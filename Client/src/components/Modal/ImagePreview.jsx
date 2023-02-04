import { BsJournalCode } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "./Modal.css";

const ImagePreview = ({ showModal, closeModal, previewImage, setImage }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "container") {
      closeModal();
    }
  };
  const submitData = () => {
    setImage(previewImage);
    closeModal();
  };
  const discardImage = () => {
    setImage("");
    closeModal();
  };
  if (!showModal) {
    return null;
  }
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        id="container"
        onClick={handleOnClose}
      >
        <div className="w-[30%] p-2 bg-[#202036] rounded-lg">
          <div className="flex justify-between items-center w-full px-5 py-2">
            <p className="font-semibold text-xl text-slate-300">
              Image Preview
            </p>
            <AiOutlineCloseCircle
              size={"1.5rem"}
              className="cursor-pointer"
              onClick={discardImage}
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <img
              width={350}
              height={200}
              src={URL.createObjectURL(previewImage)}
              className="p-2 my-2"
            />
            <button
              className="bg-indigo-500 text-gray-200 px-2 py-1 rounded  hover:bg-indigo-400 w-[40%] my-2"
              onClick={submitData}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagePreview;
