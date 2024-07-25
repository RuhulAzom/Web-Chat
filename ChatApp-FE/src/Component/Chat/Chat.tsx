
import { useContext, useEffect, useRef, useState } from "react";
import Heading from "./Heading";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { getUserData } from "../../Utils/help";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Api_Url } from "../../env";
import { AppContexts } from "../../ShareComponent";


export default function Chat({ receiver, setReceiver }: any) {

    const { message, setMessage, setScrollChat, sending } = useContext(AppContexts)

    const { chat } = useParams()
    const { pathname } = useLocation()
    const userData = getUserData()

    // @ts-ignore
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)


    const scrollToBottom = useRef<HTMLDivElement>(null);

    const GetMessageByConversationsId = async (page: number) => {
        setLoading(true)
        try {
            const res = await axios.get(`${Api_Url}/messages/${chat}?page=${page}`)
            const data = [...res.data.data]
            if (Object.keys(receiver).length === 0) {
                const res = await axios.get(`${Api_Url}/auth/users/conversations/${chat}`);
                const data = [...res.data.data]
                const receiv = data.filter((item: any) => item.id !== userData.id)[0]
                setReceiver(receiv)
            }
            data.sort((a: any, b: any) => {
                const aTime = new Date(a.createAt).getTime();
                const bTime = new Date(b.createAt).getTime();
                return aTime - bTime;
            });
            setLoading(false)
            setScrollChat(true)
            setMessage(data)
        } catch (error) {
            console.log("Api Error in Get Message:", error)
            setLoading(false)
            return error;
        }
    }

    const updateMessages = async (page: number) => {
        try {
            const res = await axios.get(`${Api_Url}/messages/${chat}?page=${page}`)
            const data = [...message, ...res.data.data]
            const receiver = data.find((item: any) => item.senderData.id !== userData.id)
            if (receiver) {
                setReceiver({ ...receiver.senderData })
            }
            data.sort((a: any, b: any) => {
                const aTime = new Date(a.createAt).getTime();
                const bTime = new Date(b.createAt).getTime();
                return aTime - bTime;
            });
            setMessage(data)
        } catch (error) {
            console.log("Api Error in Get Message:", error)
            return error;
        }
    }

    useEffect(() => {
        GetMessageByConversationsId(1)
    }, [chat])

    useEffect(() => {
        if (page > 1) {
            updateMessages(page)
        }
    }, [page])

    // useEffect(() => {
    //     if (scrollChat) {
    //         const messageDiv = document.getElementById("message") as HTMLDivElement;
    //         console.log("scroll:", messageDiv)
    //         if (messageDiv) {
    //             console.log("awdwad:", messageDiv)
    //             messageDiv.scrollTop = messageDiv.scrollHeight;
    //         }
    //         setScrollChat(false)
    //     }
    // }, [message])


    const getReceiverIfNoMessageYet = async () => {
        try {
            const res = await axios.get(`${Api_Url}/auth/users/${pathname.split("/")[2]}`);
            const data = { ...res.data.data };
            console.log(res.data.data)
            if (res.data.status === 200) {
                setReceiver({ ...data })
            }
            return res;
        } catch (error: any) {
            console.log("Api Error in Get Receiver :", error)
            return error;
        }
    }

    useEffect(() => {
        if (Object.keys(receiver).length === 0) {
            getReceiverIfNoMessageYet()
        }
    }, [])

    // Scroll To Bottom When Get Message
    useEffect(() => {
        if (scrollToBottom.current) {
            scrollToBottom.current.scrollIntoView()
        }
    }, [message, sending])

    return (

        <div id="Chat" className=" sm:pb-[0] sm:py-[1.5rem] grid grid-rows-[auto,1fr,auto] w-full h-full">

            {/* {loading && <LoadingFullscreen />} */}

            <div id="heading" className="px-[1rem] row-span-1 flex shrink-0 justify-between text-white sm:text-black py-[.5rem] sm:pb-[.5rem] border-b border-main-border-gray relative">
                {pathname.split("/")[2] &&
                    <Heading receiver={receiver} loading={loading} />
                }
            </div>

            <div id="message" className="py-[1rem] row-span-10 h-full overflow-x-hidden overflow-y-auto px-[1rem] sm:px-[.5rem]">
                {/* <button onClick={scroll} className="bg-black relative z-[999999]">adwawd</button> */}
                <Message message={message} userData={userData} loading={loading} />
                <div ref={scrollToBottom} />
            </div>

            <div className="p-[1rem] ms:p-[unset] ms:pl-[1rem] ms:pt-[1rem] row-span-1 border-t-[0] sm:border-t sm:border-main-border-gray fixed sm:relative bottom-[0] left-[0] right-[0] z-[3]">
                {pathname.split("/")[2] &&
                    <SendMessage receiver={receiver} />
                }
            </div>

        </div>
    )
}