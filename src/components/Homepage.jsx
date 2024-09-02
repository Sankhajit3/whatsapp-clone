import React, { useEffect, useRef, useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import {
  BsEmojiSmile,
  BsFilter,
  BsMicFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import "./HomePage.css";
import Profile from "./Profile/Profile";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logOutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";

import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { Snackbar } from "@mui/material";

import Picker from "emoji-picker-react";

const Homepage = () => {
  const [querys, setQuerys] = useState(null);
  const [currentChat, setCurentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const [isGroup, setIsGroup] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { auth, chat, message } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const [stompClient, setStompClient] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const messageRef = useRef();

  const connect = () => {
    const sock = new SockJS("http://localhost:5454/ws");
    const temp = over(sock);
    setStompClient(temp);
    const headers = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    };
    temp.connect(headers, onConnect, onError);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const onError = (error) => {
    console.log("on error ", error);
  };

  const onConnect = () => {
    setIsConnect(true);
  };

  useEffect(() => {
    if (message.newMessage && stompClient) {
      setMessages([...messages, message.newMessage]);
      stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
      messageRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [message.newMessage]);

  const onMessageReceive = (payload) => {
    console.log("receive message ", JSON.parse(payload.body));
    const receivedMessage = JSON.parse(payload.body);
    setMessages([...messages, receivedMessage]);
  };

  useEffect(() => {
    if (isConnect && stompClient && auth.reqUser && currentChat) {
      const subscription = stompClient.subscribe(
        `/user/${currentChat?.id}/private`,
        onMessageReceive
      );
      stompClient.subscribe(
        "/group/" + currentChat.id.toString(),
        onMessageReceive
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  });

  const sendMessageToServer = () => {
    if (stompClient && currentChat?.id) {
      const messageContent = content.trim(); // Trim any leading or trailing spaces
      if (messageContent) {
        const messageData = {
          content: messageContent,
          chatId: currentChat.id,
        };
        console.log("---- send message --- ", messageData);
        stompClient?.send(
          `/app/chat/${currentChat.id.toString()}`,
          {},
          JSON.stringify(messageData)
        );
        setContent("");
      }
    }
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (message.messages) setMessages(message.messages);
  }, [message.messages]);


  const onEmojiClick = (event, emojiObject) => {
    setContent(content + " " + emojiObject.emoji);
  };

  const handleEmojiBoxClose = () => {
    setIsOpen(false);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOnChatCard = (userId) => {
    // setCurentChat(true)
    dispatch(createChat({ token, data: { userId } }));
    setQuerys("");
  };

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  const handleCreateNewMessage = () => {
    dispatch(
      createMessage({
        token,
        data: { chatId: currentChat.id, content: content },
      })
    );
    sendMessageToServer();
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  
  useEffect(() => {
    if (currentChat?.id)
      dispatch(getAllMessages({ chatId: currentChat.id, token }));
  }, [currentChat, message.newMessage]);

  const handleNavigate = () => {
    setIsProfile(true);
  };
  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };
  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  const handleLogOut = () => {
    dispatch(logOutAction());
    navigate("/signup");
  };

  const handleCurrentChat = (item) => {
    setCurentChat(item);
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    dispatch(currentUser(token));
  }, [token]);

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signup");
    }
  }, [auth.reqUser]);

  useEffect(() => {
    dispatch(getUsersChat({ token }));
  }, [chat.createdChat, chat.createdGroup]);

  return (
    <div className="relative">
      <div className="py-10 py-14 bg-indigo-900 w-full"></div>
      <div className="flex bg-sky-300 h-[90vh] absolute left-[2vw] top-[5vh] w-[96vw]">
        <div className="left w-[30%] bg-emerald-400 h-full">
          {/*profile */}
          {isGroup && <CreateGroup setIsGroup={setIsGroup} />}
          {isProfile && (
            <div className="w-full h-full">
              <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
            </div>
          )}

          {!isProfile && !isGroup && (
            <div className="w-full">
              {/*home */}
              {
                <div className="flex justify-between items-cente p-3">
                  <div
                    onClick={handleNavigate}
                    className="flex items-center space-x-3"
                  >
                    <img
                      className="rounded-full w-10 h-10 cursor-pointer"
                      src={
                        auth.reqUser?.profile_picture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                      }
                      alt=""
                    />
                    <p>{auth.reqUser?.full_name}</p>
                  </div>
                  <div className="space-x-3 text-2xl flex">
                    <TbCircleDashed
                      className="cursor-pointer"
                      onClick={() => navigate("/status")}
                    />
                    <BiCommentDetail />
                    <div>
                      <BsThreeDotsVertical
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      />

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={() => navigate("/profile")}>
                          Profile
                        </MenuItem>
                        <MenuItem onClick={handleCreateGroup}>
                          Creat Group
                        </MenuItem>
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              }

              <div className="relative flex justify-center items-center bg-white py-4 px-3 ">
                <input
                  className="border-none outline-none bg-slate-200 rounded-md w-[93%] py-2 pl-9"
                  type="text"
                  placeholder="Search or start new chat"
                  onChange={(e) => {
                    setQuerys(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  value={querys}
                />
                <AiOutlineSearch className="left-6 top-6 absolute" />
                <div>
                  <BsFilter className="ml-4 text-3xl" />
                </div>
              </div>

              {/* all user*/}
              <div className="bg-white overflow-y-scroll h-[72vh] px-3">
                {querys &&
                  auth.searchUser?.map((item) => (
                    <div onClick={() => handleClickOnChatCard(item.id)}>
                      {" "}
                      <hr />
                      <ChatCard
                        name={item.full_name}
                        userImg={
                          item.profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                        }
                      />
                    </div>
                  ))}

                {chat.chats.length > 0 &&
                  !querys &&
                  chat.chats?.map((item) => (
                    <div onClick={() => handleCurrentChat(item)}>
                      {" "}
                      <hr />
                      {item.is_group ? (
                        <ChatCard
                          name={item.chat_name}
                          userImg={
                            item.chat_image ||
                            "https://cdn.pixabay.com/photo/2017/10/13/12/29/hands-2847508_640.jpg"
                          }
                        />
                      ) : (
                        <ChatCard
                          isChat={true}
                          name={
                            auth.reqUser?.id !== item.users[0]?.id
                              ? item.users[0].full_name
                              : item.users[1].full_name
                          }
                          userImg={
                            auth.reqUser.id !== item.users[0].id
                              ? item.users[0].profile_picture ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                              : item.users[1].profile_picture ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                          }
                          message={
                            (item.id ===
                              messages[messages.length - 1]?.chat?.id &&
                              messages[messages.length - 1]?.content) 
                          }
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* default chat page */}

        {!currentChat && (
          <div className="w-[70%] flex flex-col items-center justify-center">
            <div className="max-w-[70%] text-center">
              <img
                src="https://img.freepik.com/free-photo/3d-render-talk-chat-bubbles-comment-app-icon_107791-16999.jpg?t=st=1708852567~exp=1708856167~hmac=a2028dfc8ca0967d596a2b55f122b9b24c1d510fa4dd5810a0aad274f3db1744&w=1380"
                alt=""
              />
              <h1 className="text-4xl text-gray-600">Chat web</h1>
              <p className="my-9 ">
                Every Good Conversation Starts With A Good Listener
              </p>
            </div>
          </div>
        )}
        {/* {message part} */}
        {currentChat && (
          <div className="w-[70%] relative">
            <div className="header absolute top-0 w-full bg-emerald-100	">
              <div className="flex justify-between">
                <div className="py-3 space-x-4 flex items-center px-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={
                      currentChat.is_group
                        ? currentChat.chat_image ||
                          "https://cdn.pixabay.com/photo/2017/10/13/12/29/hands-2847508_640.jpg"
                        : auth.reqUser.id !== currentChat.users[0].id
                        ? currentChat.users[0].profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                        : currentChat.users[1].profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                    }
                    alt=""
                  />
                  <p>
                    {currentChat.is_group
                      ? currentChat.chat_name
                      : auth.reqUser?.id === currentChat.users[0].id
                      ? currentChat.users[1].full_name
                      : currentChat.users[0].full_name}
                  </p>
                </div>
                <div className="py-3 flex space-x-4 items-center px-3">
                  <AiOutlineSearch />
                  <BsThreeDotsVertical />
                </div>
              </div>
            </div>

            {/*massage section */}

            <div
              onClick={handleEmojiBoxClose}
              className="px-10 h-[85vh] overflow-y-scroll bg-sky-200"
            >
              <div className="space-y-1 flex flex-col justify-center border-0 mt-20 py-2">
                {messages.length > 0 &&
                  messages?.map((item, i) => (
                    <MessageCard
                      messageRef={messageRef}
                      key={item.id}
                      isReqUserMessage={item.user.id !== auth.reqUser.id}
                      content={`${item.content}`}
                    />
                  ))}
              </div>
            </div>

            {/*footer part */}

            <div className="footer bg-slate-400 absolute bottom-0 w-full py-1 text-2xl ">
              <div className="flex justify-between items-center px-5 relative">
                <BsEmojiSmile
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer"
                />
                <ImAttachment />
                <div
                  className={`${
                    isOpen ? "block" : "hidden"
                  } absolute bottom-16`}
                >
                  <Picker onEmojiClick={onEmojiClick} />
                </div>

                <input
                  className="py-2 outline-none border-none h-9 bg-white pl-4 rounded-md w-[85%]"
                  type="text"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type message"
                  value={content}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateNewMessage();
                      setContent("");
                    }
                  }}
                />
                <BsMicFill />
              </div>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        message={`Welcome ${auth.reqUser?.full_name}`}
        open={open}
        handleClose={handleClose}
        type={"success"}
      />
    </div>
  );
};

export default Homepage;
