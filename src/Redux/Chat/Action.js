import { BASE_API_URL } from "../../config/api"
import { CREATE_GROUP_CHAT, CREATE_SINGLE_CHAT, GET_ALL_CHAT } from "./ActionType";

export const createChat=(chatData)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/api/chats/single`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${chatData.token}`
            },
            body:JSON.stringify(chatData.data)
        })

        const data=await res.json();
        console.log("create single chat ",data)
        dispatch({type:CREATE_SINGLE_CHAT,payload:data})

    } catch (error) {
        console.log("Catch error",error)
    }
}

export const createGroupChat=(chatData)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/api/chats/group`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${chatData.token}`
            },
            body:JSON.stringify(chatData.group)
        })

        const data=await res.json();
        console.log("create group chat ",data)
        dispatch({type:CREATE_GROUP_CHAT,payload:data})

    } catch (error) {
        console.log("Catch error",error)
    }
}

export const getUsersChat=(chatData)=>async(dispatch)=>{
    try {
        const res=await fetch(`${BASE_API_URL}/api/chats/user`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${chatData.token}`
            },
        })

        const data=await res.json();
        console.log("Get Users chat ",data)
        dispatch({type:GET_ALL_CHAT,payload:data})
    } catch (error) {
        console.log("Catch error",error)
    }
}
