import React from "react";
import { AiOutlineDown } from "react-icons/ai";

const ChatCard = ({ name, userImg, sentTime, isChat, message }) => {
  return (
    <div className="flex items-center justify-center py-2 group cursor-pointer">
      <div className="w=[20%]">
        <img className="h-14 w-14 rounded-full" src={userImg} alt="" />
      </div>
      <div className="pl-5 w-[80%]">
        <div className="flex justify-between items-center">
          <p className="text-lg">{name}</p>
          {isChat && <p className="text-sm">{sentTime}</p>}
        </div>
        <div className="flex justify-between items-center">
          <p
            className={`${
              isChat && message?.length > 0 ? "visible" : "invisible"
            }`}
          >
            {message?.length > 15 ? message.slice(0, 15) + "..." : message}
          </p>
          <div className="flex space-x-2 items-center">
            <div className="flex justify-end flex-1">
              {isChat && <AiOutlineDown className=" group-hover:block" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
