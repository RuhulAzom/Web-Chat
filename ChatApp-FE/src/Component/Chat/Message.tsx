import { useLocation } from "react-router-dom";
import ImageType from "../../SubComponent/Image";
import { getDate, getHours } from "../../Utils/function";
import { useContext } from "react";
import { AppContexts } from "../../ShareComponent";

export default function Message({ message, userData, loading }: any) {
    const { pathname } = useLocation()
    const { sending } = useContext(AppContexts)

    return (
        <div id="containerMessage" className="flex flex-col gap-[1.5rem] relative pb-[5rem] sm:pb-[1rem] min-h-full">
            <div className="absolute bg-[#ffffffd5] top-[-1rem] left-[-1rem] sm:left-[-.5rem] right-[-1rem] sm:right-[-.5rem] bottom-[-1rem] z-[1]" />
            {!loading ?
                <>
                    {userData && message?.map((item: any, i: any) => (
                        <div key={i} className={`${userData?.id === item.senderId && "justify-end"} flex z-[2]`}>
                            <div className={`flex justify-start items-start gap-2 ${userData?.id === item.senderId && "flex-row-reverse"}`}>
                                <div className="hidden sm:flex w-[4rem] h-[4rem]  rounded-full overflow-hidden shrink-0  justify-center items-center border border-main-border-gray bg-white">
                                    <ImageType src={item.senderData.image} url={item.senderData.image} />
                                </div>
                                <div className={`relative px-[1rem] pt-[1rem] pb-[.5rem] max-w-[300px] sm:max-w-[450px] min-w-[100px] rounded-[1rem] ${userData?.id === item.senderId ? " rounded-tr-none bg-main-purple text-white" : " rounded-tl-none bg-[rgb(228,228,251)] text-black"}`}>
                                    <p className="break-words">{item.message}</p>
                                    <div className="w-full flex justify-end items-center gap-1">
                                        <p className={`text-[.8rem] ${userData?.id !== item.senderId && "text-text-gray"}`}>
                                            {getHours(item.createAt)}
                                        </p>
                                        {userData?.id === item.senderId &&
                                            <i className={`bx bx-check-double text-[1.3rem]`}></i>
                                        }

                                    </div>
                                    <p className={`text-[.8rem] absolute text-black top-[100%] ${userData.id === item.senderId ? "right-[.5rem]" : "left-[.5rem]"} whitespace-nowrap`}>
                                        {getDate(item.createAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {sending &&
                        <div className={`justify-end flex z-[2] pt-[1rem]`}>
                            <div className={`flex justify-start items-start gap-2 flex-row-reverse`}>
                                <div className={`relative px-[1rem] pt-[1rem] pb-[.5rem] max-w-[300px] sm:max-w-[450px] min-w-[100px] rounded-[1rem] rounded-tr-none bg-main-purple text-white`}>
                                    <p className="break-words">Sending a message...</p>
                                    <div className="w-full flex justify-end items-center gap-1">
                                        <p className={`text-[.8rem]`}>
                                            {getHours(new Date())}
                                        </p>
                                    </div>
                                    <p className={`text-[.8rem] absolute text-black top-[100%] right-[.5rem] whitespace-nowrap`}>
                                        Sending.....
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    {!pathname.split("/")[2] && message.length === 0 &&
                        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full z-[2]">
                            <div className="text-center text-black font-[600] text-[1.8rem]">
                                <h1>
                                    Welcome To WebChat
                                </h1>
                                <h1>
                                    Start Messaging Now
                                </h1>
                            </div>
                        </div>
                    }
                    {pathname.split("/")[2] && message.length === 0 &&
                        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full z-[2]">
                            <div className="text-center text-black font-[600] text-[1.8rem]">
                                <h1>
                                    No Messages Yet
                                </h1>
                            </div>
                        </div>
                    }
                </>
                :
                <>
                    {Array.from({ length: 8 }).map((_: any, i: any) => (
                        <div key={i} className={`${i % 2 === 0 && "justify-end"} flex z-[2]`}>
                            <div className={`flex justify-start items-start gap-2 ${i % 2 === 0 && "flex-row-reverse"}`}>
                                <div id="Loading" className="hidden sm:flex w-[4rem] h-[4rem]  rounded-full overflow-hidden shrink-0  justify-center items-center border border-main-border-gray bg-text-gray">
                                </div>
                                <div id="Loading" className={` px-[1rem] pt-[1rem] pb-[.5rem] max-w-[80%] sm:max-w-[450px] min-w-[100px] rounded-[1rem] relative ${i % 2 === 0 ? " rounded-tr-none bg-main-purple text-white" : " rounded-tl-none bg-[rgb(228,228,251)] text-black"}`}>
                                    <p className="text-transparent">Loading...Loading. ..Loading...L oading...Loadin g...Loading.. .Loading. ..Loading...Loading...L oading...</p>
                                    <div className="w-full flex justify-end items-center gap-1">
                                        <p className={`text-[.8rem] text-transparent ${i % 2 !== 0 && "text-text-gray"}`}>
                                            02:27
                                        </p>
                                        <i className={`bx bx-check-double text-[1.3rem] text-transparent ${i % 2 !== 0 && "text-text-gray"}`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            }
        </div>
    )
}