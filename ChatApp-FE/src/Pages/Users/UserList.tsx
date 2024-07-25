import { useContext, useEffect } from "react";
import { getUserData } from "../../Utils/help";
import axios from "axios";
import { Api_Url } from "../../env";
import ImageType from "../../SubComponent/Image";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContexts } from "../../ShareComponent";
import LoadingSearchMobile from "../../SubComponent/Loading/loadingSearchMobile copy";
import notFound from "../../assets/icon/not-found.png"

export default function UserList({ setReceiver, loading }: any) {

    const { pathname } = useLocation()

    const { setMessage, onlineUsers, allUsers, setAllUsers, onSearchOnlineUser, sameOnline, OnSearchOnline, sameUser, allUsersLength } = useContext(AppContexts)


    const Me = getUserData()

    const navigate = useNavigate()

    const getAllUsers = async () => {
        const userData = getUserData()
        try {
            const res = await axios.get(`${Api_Url}/auth/users`);
            const data = [...res.data.data];
            const setData = data.filter((item: any) => item.id !== userData.id)
            setAllUsers(setData)
        } catch (error) {
            console.log("Api Error in Get All Users:", error)
            return error;
        }
    }

    const GetConversationByMemberId = async (receiverId: any, dataReceiver: any) => {
        const userData = getUserData()
        if (userData.id === dataReceiver.id) {
            return;
        }
        try {
            const res = await axios.get(`${Api_Url}/conversations/member/user?senderId=${userData.id}&receiverId=${receiverId}`);
            // const data = [...res.data.data];
            if (res.data.status === 200) {
                setReceiver({ ...dataReceiver })
                navigate(`/Home/${res.data.data.id}`)
            }
            return res;
        } catch (error: any) {
            console.log("Api Error in Get All Users:", error)
            if (error.response.status === 404) {
                navigate(`/Home/${dataReceiver.id}`)
                setReceiver({ ...dataReceiver })
                setMessage([])
            }
            return error;
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [pathname, onlineUsers])

    return (
        <div className="bg-transparent h-full py-0 sm:py-[.5rem] w-full block sm:hidden text-black pt-[1.5rem]">
            <div className="bg-white flex h-full sm:rounded-[2rem] sm:pr-0 sm:pl-[1.5rem]">
                {!loading && pathname === "/Users" ?
                    <div id="all" className="bg-white row-span-1 rounded-[2rem] text-black p-[1rem] h-full w-full overflow-hidden relative grid grid-rows-[auto,1fr]">
                        <div className="pb-[1rem]">
                            <h1 className="text-[1.5rem] font-[700]">
                                All Users({allUsersLength})
                            </h1>
                        </div>
                        <div className="flex h-full pr-[.5rem] flex-col gap-1 overflow-y-scroll">
                            {sameUser &&
                                <div id="item" className="flex gap-2 justify-start items-start cursor-pointer p-[.5rem] rounded-[.5rem]">
                                    <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray">
                                        <ImageType src={Me.image} url={Me.image} />
                                    </div>
                                    <div className="">
                                        <p id="username" className="text-[.8rem] font-[700]">
                                            {Me.username} (You)
                                        </p>
                                        <p id={`${!Me.online && "status"}`} className={`text-green-500 text-[.7rem]`}>
                                            Online
                                        </p>
                                    </div>
                                </div>
                            }
                            {allUsers?.length > 0 && allUsers?.map((item: any, i: number) => (
                                <div key={i} id="item" className="flex gap-2 justify-start items-start hover:bg-main-purple cursor-pointer p-[.5rem] rounded-[.5rem]"
                                    onClick={() => GetConversationByMemberId(item.id, item)}
                                >
                                    <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray">
                                        <ImageType src={item.image} url={item.image} />
                                    </div>
                                    <div className="">
                                        <p id="username" className="text-[.8rem] font-[700]">
                                            {item.username}
                                        </p>
                                        <p id={`${!item.online && "status"}`} className={`${item.online ? "text-green-500 font-[600]" : "text-text-gray"} text-[.7rem]`}>
                                            {item.online ? "Online" : "Offline"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {allUsers?.length === 0 && !sameUser &&
                                <div className="w-full h-full flex justify-center items-center flex-col">
                                    <img src={notFound} alt="" className="w-[5rem] mt-[-4rem]" />
                                    <p className="text-gray-400">User not found</p>
                                </div>
                            }
                        </div>
                    </div>
                    : loading && pathname === "/Users" ?
                        <div className="w-full flex justify-center items-center">
                            <LoadingSearchMobile />
                        </div>
                        : null
                }
                {pathname === "/Online" &&
                    <div id="all" className="bg-white row-span-1 rounded-[2rem] text-black p-[1rem] h-full w-full overflow-hidden relative grid grid-rows-[auto,1fr]">
                        <div className="pb-[1rem]">
                            <h1 className="text-[1.5rem] font-[700]">
                                Online Users ({onlineUsers?.length + 1})
                            </h1>
                        </div>
                        <div className="flex h-full pr-[.5rem] flex-col gap-1 overflow-y-scroll">
                            {sameOnline &&
                                <div id="item" className="flex gap-2 justify-start items-start cursor-pointer p-[.5rem] rounded-[.5rem]">
                                    <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray">
                                        <ImageType src={Me.image} url={Me.image} />
                                    </div>
                                    <div className="">
                                        <p id="username" className="text-[.8rem] font-[700]">
                                            {Me.username} (You)
                                        </p>
                                        <p id={`${!Me.online && "status"}`} className={`text-green-500 text-[.7rem]`}>
                                            Online
                                        </p>
                                    </div>
                                </div>
                            }
                            {!OnSearchOnline && onlineUsers?.length > 0 && onlineUsers?.map((item: any, i: number) => (
                                <div key={i} id="item" className="flex gap-2 justify-start items-start hover:bg-main-purple cursor-pointer p-[.5rem] rounded-[.5rem]"
                                    onClick={() => GetConversationByMemberId(item.id, item)}
                                >
                                    <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray">
                                        <ImageType src={item.image} url={item.image} />
                                    </div>
                                    <div className="">
                                        <p id="username" className="text-[.8rem] font-[700]">
                                            {item.username}
                                        </p>
                                        <p id={`${!item.online && "status"}`} className={`text-green-500 text-[.7rem]`}>
                                            Online
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {OnSearchOnline && onSearchOnlineUser?.length > 0 &&
                                onSearchOnlineUser?.map((item: any, i: number) => (
                                    <div key={i} id="item" className="flex gap-2 justify-start items-start hover:bg-main-purple cursor-pointer p-[.5rem] rounded-[.5rem]"
                                        onClick={() => GetConversationByMemberId(item.id, item)}
                                    >
                                        <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray">
                                            <ImageType src={item.image} url={item.image} />
                                        </div>
                                        <div className="">
                                            <p id="username" className="text-[.8rem] font-[700]">
                                                {item.username}
                                            </p>
                                            <p id={`${!item.online && "status"}`} className={`text-green-500 text-[.7rem]`}>
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                            {OnSearchOnline && onSearchOnlineUser?.length === 0 && !sameOnline &&
                                <div className="w-full h-full flex justify-center items-center flex-col">
                                    <img src={notFound} alt="" className="w-[5rem] mt-[-4rem]" />
                                    <p className="text-gray-400">User not found</p>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}