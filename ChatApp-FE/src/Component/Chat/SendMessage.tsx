import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react"
import { Api_Url, Socket_Url } from "../../env";
import { getUserData } from "../../Utils/help";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { AppContexts } from "../../ShareComponent";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from 'emoji-picker-react';


export default function SendMessage({ receiver }: any) {
    const navigate = useNavigate()

    const { chat } = useParams()

    const input = useRef<any>(null)

    const { setSending } = useContext(AppContexts)

    const [sendMessage, setSendMessage] = useState<string>("")
    const [showEmoji, setShowEmoji] = useState<boolean>(false)
    const [openEmoji, setOpenEmoji] = useState<boolean>(false)
    const [socket, setSocket] = useState<any>(null)
    useEffect(() => {
        setSocket(io(`${Socket_Url}`))
    }, [])

    const SendMessages = async () => {
        const userData = getUserData()
        setSendMessage("")
        setSending(true)
        try {
            const res = await axios.post(`${Api_Url}/messages`, {
                senderId: userData.id,
                receiverId: receiver.id,
                message: sendMessage
            })
            if (res.status === 201) {
                // console.log(res.data.conversationsId)
                socket?.emit("addConversations", {
                    senderId: userData.id,
                    receiverId: receiver.id,
                })
                socket.emit("sendMessages", {
                    conversationId: res.data.conversationsId,
                    senderId: userData.id,
                    receiverId: receiver.id,
                    message: sendMessage
                })
                navigate(`/Home/${res.data.conversationsId}`)
            }
            socket.emit("sendMessages", {
                conversationId: chat,
                senderId: userData.id,
                receiverId: receiver.id,
                message: sendMessage
            })
            console.log(res)
            return res;
        } catch (error) {
            console.log("Api Error SendMessages:", error)
            return error;
        }
    }

    const handleEmoji = (emojiData: any, event: any) => {
        if (event.key === "Enter") {
            return;
        }
        setSendMessage((prev) => `${prev}${emojiData.emoji}`)
    }

    return (
        <form id="sendMessage" className={`bg-body sm:bg-[#c2d1ec63] flex justify-between rounded-[2rem]`}
            onSubmit={(e) => {
                e.preventDefault();
                SendMessages()
            }}
        >
            <div className="relative flex justify-center">
                <div className="h-full flex justify-center items-center px-[1rem] sm:px-[.5rem] active:bg-[#8f8f8fad] hover:bg-[#bebebead] duration-300 rounded-[2rem] text-white sm:text-black"
                    onClick={() => { setOpenEmoji(!openEmoji); setShowEmoji(true) }}
                >
                    <i className='bx bx-smile text-[1.5rem]' />
                </div>
                {openEmoji && <div className="fixed top-0 left-0 w-full h-full z-[99] bg-transparent " onClick={() => { setOpenEmoji(false); input.current.focus() }} />}
                {showEmoji &&
                    <div className={`absolute left-0 sm:left-[unset] bottom-[100%] overflow-hidden ${openEmoji ? "h-[500px]" : "h-0"} flex items-end duration-300 z-[999]`}>
                        <div className="hidden sm:block">
                            <EmojiPicker height={"500px"} onEmojiClick={handleEmoji} emojiStyle={EmojiStyle.NATIVE} />
                        </div>
                        <div className="block sm:hidden">
                            <EmojiPicker height={"500px"} width={"100%"} onEmojiClick={handleEmoji} emojiStyle={EmojiStyle.NATIVE} />
                        </div>
                    </div>
                }
            </div>
            <input type="text" ref={input} placeholder="Your message" className="w-full bg-transparent p-[1rem] pl-0 sm:pl-[.5rem] sm:p-[unset] sm:px-[1rem] sm:py-[.5rem] text-[1rem] sm:text-[.9rem] outline-none text-white sm:text-black"
                onChange={(e) => setSendMessage(e.target.value)} value={sendMessage}
            />
            <button type="submit" className="pr-4 min-h-full shrink-0 flex justify-end items-center">
                <i id="sendMessageSubmit" className='bx bx-send text-main-purple text-[1.3rem] cursor-pointer hover:scale-105 duration-200'></i>
            </button>
        </form>
    )
}