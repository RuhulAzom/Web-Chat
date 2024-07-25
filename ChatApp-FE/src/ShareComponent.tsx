import { createContext, useEffect, useState } from "react";
import { getUserData } from "./Utils/help";
import { Api_Url, Socket_Url } from "./env";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import axios from "axios";


export default function ShareComponent({ children }: any) {
    const { pathname } = useLocation()

    // const conversationIdParams = pathname.split("/")[2]

    const test = "Awdwad"
    const userData = getUserData()

    const [socket, setSocket] = useState<any>(null)

    // Conversations
    const [conversationsData, setConversationsData] = useState<any>([])
    const [conversationsTrigger, setConversationsTrigger] = useState<any>({})
    const [conversationsLength, setConversationsLength] = useState<number>(0)
    const [loadingSearchMobile, setLoadingSearchMobile] = useState<boolean>(false)

    // Messages
    const [message, setMessage] = useState<any>([])
    const [messageUpdate, setMessageUpdate] = useState<any>({})
    const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false)
    const [scrollChat, setScrollChat] = useState<boolean>(false)
    const [sending, setSending] = useState<boolean>(false)

    // Users
    const [allUsers, setAllUsers] = useState<any>([])
    const [allUsersLength, setAllUsersLength] = useState<number>(0)
    const [sameUser, setSameUser] = useState<boolean>(true)


    // Users Online
    const [onlineUsers, setOnlineUsers] = useState<any>([])
    const [onSearchOnlineUser, setOnSearchOnlineUser] = useState<any>([])
    const [sameOnline, setSameOnline] = useState<boolean>(true)
    const [OnSearchOnline, setOnSearchOnline] = useState<boolean>(false)

    // Inialisasi Socket
    useEffect(() => {
        setSocket(io(`${Socket_Url}`))
    }, [])

    // Socket Execute
    useEffect(() => {
        const userData = getUserData()
        if (userData) {
            socket?.emit("addUser", { ...userData })
            socket?.on("onlineUsers", (users: any) => {
                console.log("Active user:", users)
                const data = users.filter((item: any) => item.id !== userData.id)
                setOnlineUsers([...data])
            })

            socket?.on("getMessages", (data: any) => {
                console.log("messages", data)
                console.log("bandingan:", pathname.split("/")[2])
                if (data.conversationId === pathname.split("/")[2]) {
                    console.log("messageUpdate")
                    setMessageUpdate(data)
                }
                socket.emit("addConversations", {
                    senderId: data.senderId,
                    receiverId: userData.id
                })
            })
        }
    }, [socket, pathname])

    // Update Message
    useEffect(() => {
        if (isMessageOpen) {
            console.log("tambahchat")
            setScrollChat(true)
            setSending(false)
            setMessage((prev: any) => {
                return [...prev, messageUpdate]
            })
            setConversationsTrigger({ ...messageUpdate })
        }
    }, [messageUpdate])

    // Open Message
    useEffect(() => {
        const value = pathname.split("/")[2];
        if (value) {
            setIsMessageOpen(true)
        } else {
            setIsMessageOpen(false)
        }
    }, [pathname])

    // Update Conversations When get messages
    useEffect(() => {
        if (conversationsTrigger) {
            const conversationFilter = conversationsData.filter((item: any) => item.id !== conversationsTrigger.conversationId)
            let conversationUpdate = conversationsData.filter((item: any) => item.id === conversationsTrigger.conversationId)
            if (conversationUpdate[0] && conversationUpdate[0].lastMessage) {
                const update = [{
                    ...conversationUpdate[0],
                    lastMessage: {
                        ...conversationUpdate[0].lastMessage,
                        message: conversationsTrigger.message,
                        createAt: new Date()
                    }
                }]
                setConversationsData([...update, ...conversationFilter])
            }
        }
    }, [conversationsTrigger])

    // Conversations Length
    useEffect(() => {
        if (userData) {
            axios.get(`${Api_Url}/conversations-length/user/${userData.id}`).then((res: any) => setConversationsLength(res.data.data))
        }
    }, [conversationsData])

    // Users Length
    useEffect(() => {
        axios.get(`${Api_Url}/auth/users-length`).then((res: any) => setAllUsersLength(res.data.data))
    }, [onlineUsers])

    return (
        <AppContexts.Provider value={{ test, socket, message, setMessage, scrollChat, setScrollChat, onlineUsers, setOnlineUsers, allUsers, setAllUsers, conversationsData, setConversationsData, onSearchOnlineUser, setOnSearchOnlineUser, sameOnline, setSameOnline, OnSearchOnline, setOnSearchOnline, sameUser, setSameUser, allUsersLength, conversationsLength, sending, setSending, loadingSearchMobile, setLoadingSearchMobile }}>
            {children}
        </AppContexts.Provider>
    )
}

export const AppContexts = createContext<any>(null)






// Untuk Console.Log Scroll
// useEffect(() => {
//     if (scrollChat) {
//         const messageDiv = document.getElementById("message") as HTMLDivElement;
//         const handleScroll = () => {
//             console.log("Scroll position:", messageDiv.scrollTop, "/", messageDiv.scrollHeight);
//         };

//         messageDiv.addEventListener("scroll", handleScroll);

//         return () => {
//             messageDiv.removeEventListener("scroll", handleScroll);
//         };
//     }
// }, [scrollChat]);