import { useContext, useEffect, useState } from "react"
import ImageType from "../../SubComponent/Image"
import LoadingSearch from "../../SubComponent/Loading/loadingSearch"
import { getUserData } from "../../Utils/help"
import axios from "axios"
import { Api_Url } from "../../env"
import { AppContexts } from "../../ShareComponent"
import notFound from "../../assets/icon/not-found.png"

export default function AllUsers({ GetConversationByMemberId }: any) {
    const { allUsers, setAllUsers, onlineUsers, allUsersLength } = useContext(AppContexts)

    const Me = getUserData()

    const [loading, setLoading] = useState<boolean>(false)
    const [same, setSame] = useState<boolean>(true)

    const [value, setValue] = useState<string>("")

    const getAllUsers = async () => {
        const userData = getUserData()
        try {
            const res = await axios.get(`${Api_Url}/auth/users`);
            const data = [...res.data.data];
            const setData = data.filter((item: any) => item.id !== userData.id)
            // console.log(res)
            setAllUsers(setData)
        } catch (error) {
            console.log("Api Error in Get All Users:", error)
            return error;
        }
    }
    useEffect(() => {
        getAllUsers()
    }, [onlineUsers])

    const handleSearch = async () => {
        setLoading(true)
        setSame(false)
        try {
            const res = await axios.get(`${Api_Url}/users/${value}`)
            console.log(res)
            const data = [...res.data.data].filter((item: any) => item.id !== Me.id)
            const isMeAvailabe = [...res.data.data].filter((item: any) => item.id === Me.id);
            if (isMeAvailabe.length !== 0) {
                setSame(true)
            }
            setAllUsers([...data])
            setLoading(false)
        } catch (error) {
            console.log("Api Error in Search All Users:", error);
            setLoading(false)
            return error;
        }
    }

    useEffect(() => {
        if (value.length === 0) {
            getAllUsers()
            setSame(true)
        }
    }, [value])

    return (
        <div id="all" className="bg-white row-span-1 rounded-[2rem] text-black p-[1rem] h-full overflow-hidden relative grid grid-rows-[auto,1fr]">
            <div className="pb-[1rem] h-fit">
                <h1 className="text-[1.5rem] font-[700]">
                    All Users <span className="text-[.9rem] font-[500]">({allUsersLength})</span>
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
                    <i className='bx bx-search absolute right-[1rem] hover:bg-gray-600 rounded-[50%] p-[.2rem] hover:text-white'
                        onClick={() => handleSearch()}
                    />
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
                    {allUsers?.length === 0 && !same &&
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