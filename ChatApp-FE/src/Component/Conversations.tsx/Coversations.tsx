import { useNavigate } from "react-router-dom";
import SearchConversations from "./Search";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Api_Url } from "../../env";
import { getUserData } from "../../Utils/help";
import ImageType from "../../SubComponent/Image";
import { getTimeConversationsLastMessage } from "../../Utils/function";
import { AppContexts } from "../../ShareComponent";
import LoadingSearch from "../../SubComponent/Loading/loadingSearch";
import LoadingSearchMobile from "../../SubComponent/Loading/loadingSearchMobile copy";
import notFound from "../../assets/icon/not-found.png"

export default function Conversations({ setReceiver }: any) {
    const navigate = useNavigate()

    const { socket, conversationsData, setConversationsData } = useContext(AppContexts)

    const [loading, setLoading] = useState<boolean>(true)
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false)

    const GetConversations = async (noLoading?: boolean) => {
        const user = getUserData();
        if (noLoading) {
            setLoading(false)
        } else {
            setLoading(true)
        }
        try {
            const res = await axios.get(`${Api_Url}/conversations/user/${user.id}`)
            setConversationsData([...res.data.data])
            setLoading(false)
        } catch (error) {
            console.log("Api Error in Get Conversations:", error)
            setLoading(false)
            return error;
        }
    }
    useEffect(() => {
        GetConversations()
    }, [])

    const handleGoToMessage = (item: any) => {
        setReceiver({ ...item.receiver })
        navigate(`/Home/${item.id}`)
    }
    const handleToMessageMobile = (item: any) => {
        setTimeout(() => {
            navigate(`/Home/${item.id}`)
        }, 200);
        setReceiver({ ...item.receiver });
    }
    useEffect(() => {
        const userData = getUserData()
        if (userData) {
            socket?.on("getConversations", (data: any) => {
                console.log("getConversations-conver", data);
                GetConversations(true)
            })
        }
    }, [socket])




    return (
        <div id="Conversation" className="text-black grid grid-cols-1 grid-rows-[auto,1fr] w-full sm:w-[400px] h-full py-[unset] sm:py-[1.5rem] pr-0 sm:pr-[.5rem] sm:border-r border-main-border-gray">
            <div className="absolute bg-[#ffffffd5] top-[-1rem] left-[-.5rem] right-[-.5rem] bottom-[-1rem] z-[1] sm:hidden"></div>
            <SearchConversations loadingSearch={loadingSearch} setLoadingSearch={setLoadingSearch} />
            {!loading && conversationsData.length > 0 &&
                <div className="z-[2] flex flex-col sm:gap-2 overflow-y-scroll sm:px-[0] sm:pr-[0]">

                    {/* Dekstop */}
                    <>
                        {!loadingSearch ?
                            <>
                                {conversationsData?.map((item: any, i: any) => (
                                    <div id="conver" key={i} className="hidden sm:flex gap-4 w-full cursor-pointer text-black py-[.5rem] px-[.5rem] rounded-[.5rem] hover:bg-[#8d898983]" onClick={() => { handleGoToMessage(item) }}>
                                        <div className="w-[3rem] sm:w-[3rem] h-[3rem] sm:h-[3rem] rounded-full overflow-hidden shrink-0 flex justify-center items-center border border-main-border-gray bg-white">
                                            {/* <img src={item.receiver.image} alt="" className="w-full h-auto" /> */}
                                            <ImageType src={item.receiver.image} url={item.receiver.image} />
                                        </div>
                                        <div className="w-full flex flex-col gap-[.2rem]">
                                            <div className="flex justify-between gap-[.5rem] items-start">
                                                <h1 className="font-[600] text-[1rem] capitalize">
                                                    {item.receiver.username}
                                                </h1>
                                                <div className="text-[.9rem] text-text-gray-black font-[300]">
                                                    {getTimeConversationsLastMessage(item.lastMessage.createAt)}
                                                </div>
                                            </div>
                                            <div className="w-full text-[.8rem] flex justify-between">
                                                <p className="text-text-gray">
                                                    {item.lastMessage.message.length > 12 ? `${item.lastMessage.message.substring(0, 12)}...` : item.lastMessage.message}
                                                </p>
                                                {/* <div className="bg-main-red flex text-white justify-center items-center w-[1.3rem] h-[1.3rem] rounded-full shrink-0">
                                            <p>1</p>
                                        </div> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                            :
                            <div className="w-full pt-[5rem] hidden sm:flex justify-center">
                                <LoadingSearch text={"Searching conversations...."} />
                            </div>
                        }
                    </>

                    {/* Mobile */}
                    <>
                        {!loadingSearch ?
                            <>
                                {conversationsData?.map((item: any, i: any) => (
                                    <div id="item" key={i} className="flex sm:hidden gap-4 w-full cursor-pointer text-black px-[1rem] py-[1rem] sm:rounded-[.5rem] hover:text-white  duration-200 relative"
                                        onClick={() => handleToMessageMobile(item)}
                                    >
                                        <div id="conversationHover" className="absolute top-0 left-[50%] bottom-0 w-0 bg-hover-mobile z-[-1] duration-200"></div>
                                        <div className="w-[3.5rem] sm:w-[4rem] h-[3.5rem] sm:h-[4rem] rounded-full overflow-hidden shrink-0 flex justify-center items-center border border-main-border-gray bg-white">
                                            <ImageType src={item.receiver.image} url={item.receiver.image} />
                                        </div>
                                        <div className="w-full flex flex-col gap-[.2rem]">
                                            <div className="flex justify-between items-center">
                                                <h1 className="font-[600] text-[1.2rem]">
                                                    {item.receiver.username}
                                                </h1>
                                                <div className="text-[.9rem]">
                                                    {getTimeConversationsLastMessage(item.lastMessage.createAt)}
                                                </div>
                                            </div>
                                            <div className="text-[.8rem] flex justify-between">
                                                <p id="chat" className="text-text-gray-black">
                                                    {item.lastMessage.message.length > 12 ? `${item.lastMessage.message.substring(0, 12)}...` : item.lastMessage.message}
                                                </p>
                                                {/* <div className="bg-main-red flex text-white justify-center items-center w-[1.3rem] h-[1.3rem] rounded-full">
                                        <p>1</p>
                                    </div> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                            :
                            <div className="w-full pt-[5rem] flex sm:hidden justify-center">
                                <LoadingSearchMobile />
                            </div>
                        }
                    </>
                </div>
            }
            {!loading && conversationsData.length === 0 &&
                <div className="w-full h-full flex justify-center items-center flex-col">
                    <img src={notFound} alt="" className="w-[5rem] mt-[-4rem]" />
                    <p className="text-gray-400">Conversations not found</p>
                </div>
            }
            {loading &&
                <div className="z-[2] flex flex-col sm:gap-2 overflow-y-scroll sm:px-[.5rem] sm:pr-[.5rem]">
                    {Array.from({ length: 8 }).map((_: any, i: any) => (
                        <div key={i} className="hidden sm:flex gap-4 w-full cursor-pointer text-black p-[.5rem] rounded-[.5rem]">
                            <div id="Loading" className="w-[3rem] sm:w-[4rem] h-[3rem] sm:h-[4rem] rounded-full overflow-hidden shrink-0 flex justify-center items-center border border-main-border-gray">
                            </div>
                            <div className="w-full flex flex-col gap-[.2rem]">
                                <div className="flex justify-between items-center">
                                    <h1 id="Loading" className="font-[700] text-[1.1rem] capitalize w-full rounded-[.5rem]">
                                        Ruhulk Azo
                                    </h1>
                                </div>
                                <div className="text-[.8rem] flex justify-between w-full">
                                    <p id="Loading" className="text-text-gray rounded-[.5rem]">
                                        Woii Lagi Ngapain....
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Mobile */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex sm:hidden gap-4 w-full cursor-pointer text-black px-[1rem] py-[1rem] sm:rounded-[.5rem] hover:text-white  duration-200 relative">
                            {/* <div id="conversationHover" className="absolute top-0 left-[50%] bottom-0 w-0 bg-hover-mobile z-[-1] duration-200"></div> */}
                            <div id="Loading" className="w-[3.5rem] sm:w-[4rem] h-[3.5rem] sm:h-[4rem] rounded-full sm:rounded-[.5rem] overflow-hidden shrink-0">
                            </div>
                            <div className="w-full flex flex-col gap-[.2rem]">
                                <div id="Loading" className="flex justify-between items-center rounded-[.5rem]">
                                    <h1 className="font-[600] text-[1.2rem]">
                                        Ruhulk Azom Pratama
                                    </h1>
                                </div>
                                <div id="Loading" className="text-[.8rem] flex justify-between rounded-[.5rem]">
                                    <p id="chat" className="text-transparent">
                                        Woii Lagi Ngapain....
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            }

        </div>
    )
}