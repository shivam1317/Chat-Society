import React from "react";

const MessageSkeleton = () => {
  return (
    <div className="flex animate-pulse p-3">
      <div className="w-10 h-10 rounded-full bg-[#1E1E30]"></div>
      <div className="w-60 h-14 rounded-md bg-[#1E1E30] p-2 ml-2"></div>
    </div>
  );
};

export default MessageSkeleton;
