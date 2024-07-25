import { useContext, useEffect, useState } from "react"
import ImageType from "../../SubComponent/Image"
import LoadingSearch from "../../SubComponent/Loading/loadingSearch"
import { getUserData } from "../../Utils/help"
import { AppContexts } from "../../ShareComponent"
import notFound from "../../assets/icon/not-found.png"


export default function OnlineUsers({ GetConversationByMemberId }: any) {
    const Me = getUserData()
    const { onlineUsers, onSearchOnlineUser, setOnSearchOnlineUser } = useContext(AppContexts)

    const [value, setValue] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false)
    const [onSearch, setOnSearch] = useState<boolean>(false)
    const [same, setSame] = useState<boolean>(true)

    const handleSearch = async () => {
        try {
            setLoading(true)
            setSame(false)
            const search = onlineUsers.filter((item: any) => item.username.includes(`${value}`))
            console.log(search)
            if (value.toLowerCase().includes(`${Me.username.toLowerCase()}`)) {
                setSame(true)
            }
            setOnSearch(true)
            setOnSearchOnlineUser([...search])
            setLoading(false)
        } catch (error) {
            console.log("Api Error in Search Online Users:", error);
            setLoading(false)
            return error;
        }
    }

    useEffect(() => {
        if (value.length === 0) {
            setSame(true)
            setOnSearch(false)
            setOnSearchOnlineUser([])
        }
    }, [value])

    return (
        <div id="all" className="bg-white row-span-1 rounded-[2rem] text-black p-[1rem] h-full overflow-hidden relative grid grid-rows-[auto,1fr]">
            <div className="pb-[1rem]">
                <h1 className="text-[1.5rem] font-[700]">
                    Users Online <span className="text-[.9rem] font-[500]">({onlineUsers?.length + 1})</span>
                </h1>
                <form className="relative flex items-center w-full justify-end"
                    onSubmit={(e) => { e.preventDefault(); handleSearch() }}
                >
                    <input type="text" placeholder="Search User.." className="outline-none border-black pl-[1rem] pr-[2.5rem] py-[.3rem] text-[.8rem] w-full rounded-[1rem] bg-main-search"
                        onChange={(e) => setValue(e.target.value)} value={value}
                    />
                    {value.length > 0 &&
                        <i className='bx bx-x absolute right-[2.5rem] hover:bg-gray-600 rounded-[50%] p-[.2rem] hover:text-white'
                            onClick={() => setValue("")}
                        />
                    }
                    <i className='bx bx-search absolute right-[1rem] hover:bg-gray-600 rounded-[50%] p-[.2rem] hover:text-white' />
                </form>
            </div>
            {!loading ?
                <div className="flex h-full pr-[.5rem] flex-col gap-1 overflow-y-scroll">
                    {same &&
                        <div className="flex gap-2 justify-start items-start p-[.5rem] rounded-[.5rem]">
                            <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray">
                                {/* <img src={item.image} alt="" className="w-full h-auto" /> */}
                                <ImageType src={Me.image} url={Me.image} />
                            </div>
                            <div className="">
                                <p id="username" className="text-[.8rem] font-[700]">
                                    {Me.username} (You)
                                </p>
                                <p className="text-green-500 font-[600] text-[.7rem]">
                                    Online
                                </p>
                            </div>
                        </div>
                    }
                    {!onSearch &&
                        <>
                            {onlineUsers?.map((item: any, i: any) => (
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
                                        <p className="text-green-500 font-[600] text-[.7rem]">
                                            Online
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    }
                    {onSearch && onSearchOnlineUser.length > 0 &&
                        <>
                            {onSearchOnlineUser?.map((item: any, i: any) => (
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
                                        <p className="text-green-500 font-[600] text-[.7rem]">
                                            Online
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    }
                    {onSearch && onSearchOnlineUser.length === 0 && same === false &&
                        <div className="w-full h-full flex justify-center items-center flex-col">
                            <img src={notFound} alt="" className="w-[5rem] mt-[-4rem]" />
                            <p className="text-gray-400">User not found</p>
                        </div>
                    }
                </div>
                :
                <div className="w-full h-full flex justify-center pt-[2rem]">
                    <LoadingSearch text={"Searching users.."} />
                </div>
            }

        </div>
    )
}