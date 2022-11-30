import React from "react";

const Profile = () => {
  return (
    <>
      <div className="flex flex-col my-5 justify-center items-center w-[100%] h-[100%]">
        <div className="w-[50%] h-[50%] ">
          {/* <div className="banner">
            <img
              src="https://picsum.photos/seed/picsum/200/300"
              className="w-[100%] h-14 bg-fixed"
            />
          </div> */}
          <div className="z-0 headingPart relative flex mx-2 my-2 grid-rows-3">
            {" "}
            <div className="pfp border-4 border-[#101017] my-4 rounded-full">
              <img
                className="rounded-full"
                src="https://picsum.photos/id/237/100/100"
                alt="profile"
                id="profile"
              />{" "}
            </div>
            <div className="username my-14">nylon#7777</div>
            <div className="absolute inset-y-0 right-0 mr-2">
              <button className="my-[40%] rounded-lg p-1.5 border-2 border-[#101017] bg-[#7aa2f7]">
                Edit User Profile
              </button>
            </div>
          </div>
          <div className="socials flex"></div>
          <div className="userDetails p-3">
            <div className="bg-[#101015] rounded-lg">
              <div className="p-3 relative username flex">
                <div className="details flex flex-col">
                  <div className="name text-[12px]"> USERNAME </div>
                  <div> nylon#7777 </div>
                </div>

                <div className="mb-6 button absolute inset-y-0 right-0">
                  <button className="px-3 my-[40%] rounded-lg p-1.5 border-2 border-[#101017] bg-[#7aa2f7]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-3 relative username flex">
                <div className="details flex flex-col">
                  <div className="name text-[12px]"> EMAIL </div>
                  <div> nylon@gmail.com </div>
                </div>

                <div className="button absolute inset-y-0 right-0">
                  <button className="px-3 my-[40%] rounded-lg p-1.5 border-2 border-[#101017] bg-[#7aa2f7]">
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-3 relative username flex">
                <div className="details flex flex-col">
                  <div className="name text-[12px]"> PHONE NUMBER </div>
                  <div> 1234567890 </div>
                </div>
                <div className="button absolute inset-y-0 right-0">
                  <button className="px-3 my-[40%] rounded-lg p-1.5 border-2 border-[#101017] bg-[#7aa2f7]">
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 p-6 relative logout rounded-lg">
              <button className="bg-[#f7768e] px-4 rounded-lg border-2 border-[#101017] absolute inset-y-0 right-0">
                {" "}
                logout{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
