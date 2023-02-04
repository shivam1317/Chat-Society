import axios from "axios";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import { FiUser } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [info, setInfo] = useState({
    username: "",
    email: "",
    joinedServers: 0,
  });
  let u = JSON.parse(localStorage.getItem("userInfo"));
  const logoutUser = () => {
    const id = toast.loading("Logging out...");
    signOut(auth)
      .then(() => {
        toast.update(id, {
          render: "Logout successful..",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        localStorage.clear();
        navigate("/login");
      })
      .catch((e) => {
        toast.error("Some error occured", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        console.log(e.message);
      });
  };
  useEffect(async () => {
    const res = await axios.get(backendURL + `/userapi/getuser/${id}`);
    setInfo({
      username: res.data.Name,
      email: res.data.Email,
      joinedServers: res.data.joinedServers.length,
    });
  }, []);
  return (
    <>
      <div className="flex flex-col my-10 justify-center items-center w-[100%] h-[100%]">
        <div className="w-[50%]">
          <div className="flex mx-2 my-2 items-center justify-between">
            <div className="flex items-center">
              <button className="transition-all rounded-full p-2 bg-slate-800 h-20 w-20 flex justify-center items-center">
                <FiUser size={"2.6rem"} />
              </button>
              <div className="mx-4 flex flex-col">
                <p className="text-xl text-gray-200">{info.username}</p>
                <p className="text-md text-gray-400">
                  Joined Servers:{" "}
                  <span className="text-slate-300">{info.joinedServers}</span>
                </p>
              </div>
            </div>
            {u.userId === id ? (
              <button
                className="rounded-lg px-4 py-1 bg-red-900/30 hover:bg-red-900/50 transition-all duration-150 ease-in-out text-red-500"
                onClick={logoutUser}
              >
                Logout
              </button>
            ) : null}
          </div>
          <div className="my-5 bg-gray-800/30 rounded-lg">
            <div className="px-3 py-2">
              <p className="font-semibold text-gray-400 my-1">Username</p>
              <p className="text-gray-200 my-1">{info.username}</p>
            </div>
            <div className="px-3 py-2">
              <p className="font-semibold text-gray-400 my-1">Email</p>
              <p className="text-gray-200 my-1">{info.email}</p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Profile;
