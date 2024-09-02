import React, { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { CircularProgress, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({groupMember,setIsGroup}) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupImage,setGroupImage] =useState(null);
  const [groupName, setGroupName] = useState();
  const token=localStorage.getItem("token");
  const dispatch=useDispatch();

  const uploadToCloudnary = (pics) => {
    setIsImageUploading(true);

    const data = new FormData();

    data.append("file", pics);
    data.append("upload_preset", "Sankha123");
    data.append("cloud_name", "dctyh0cxy");
    fetch("https://api.cloudinary.com/v1_1/dctyh0cxy/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setGroupImage(data.url.toString());
        setIsImageUploading(false);
      });
  };

    const handleCreateGroup = () => {
    let userIds = [];
    
    for (let user of groupMember) {
      userIds.push(user.id);
    }
    const group = {
      userIds,
      chat_name: groupName,
      chat_image: groupImage,
    };
    const data = {
      group,
      token,
    };

    dispatch(createGroupChat(data));
    setIsGroup(false)
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
        <p className="text-xl font-semibold"></p>
      </div>

      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput" className="relative">
          <img 
            className="rounded-full h-[30vh] w-[30vh]" 
            src={groupImage || "https://cdn.pixabay.com/photo/2017/06/27/11/48/team-spirit-2447163_1280.jpg"}
            alt=""
          />
          {isImageUploading && (
            <CircularProgress className="absolute top-[5rem] left-[6rem]" />
          )}
        </label>
        <input
          type="file"
          id="imgInput"
          className="hidden"
          onChange={(e) => uploadToCloudnary(e.target.files[0])}
          value={""}
        />
      </div>
      <div className="w-full flex justify-between items-center py-2 px-5 ">
        <input
          className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent bg-white h-[5vh]"
          placeholder="Group Subject"
          value={groupName}
          type="text"
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      {groupName && (
        <div className="py-20">
        <div className="py-3 bg-sky-600 flex items-center justify-center">
          <Button onClick={handleCreateGroup}>
            {" "}
            <div className="bg-white rounded-full p-4 ">
              <BsCheck2 className="text-black font-bold text-3xl" />
            </div>{" "}
          </Button>
        </div>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
