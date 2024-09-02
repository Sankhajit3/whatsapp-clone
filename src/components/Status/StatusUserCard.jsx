import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegPlusSquare } from "react-icons/fa";

const StatusUserCard = ({user}) => {
  const navigate = useNavigate();

  const handlenavigate = () => {
    navigate(`/status/{userId}`);
  };

  return (
    <div
      onClick={handlenavigate}
      className="flex items-center p-3 cursor-ponter"
    >
      <div>
      <img
          className="rounded-full w-10 h-10 cursor-pointer"
          src={
            user?.profile_picture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          }
          alt=""
        />
      </div>
      <div className="ml-2 text-white">
        <p>{user?.full_name}</p>
      </div>
      
      
    </div>
  );
};

export default StatusUserCard;
