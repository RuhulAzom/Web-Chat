import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Api_Url } from "../env";
import { AppContexts } from "../ShareComponent";
import { getUserData } from "../Utils/help";


export default function HeaderMobile({ setLoading }: any) {

    const { pathname } = useLocation()
    const input = useRef<any>(null)

    const { onlineUsers, allUsers, setAllUsers, conversationsData, setConversationsData, setOnSearchOnlineUser, setOnSearchOnline, setSameOnline, setSameUser, allUsersLength } = useContext(AppContexts)

    const Me = getUserData()

    const [option, setOption] = useState<string>("conversations")

    const [show, setShow] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    const [tempData, setTempData] = useState<any>([])

    const handleShowSearch = () => {
        setTimeout(() => {
            setShow(true)
            input.current.focus()
        }, 200);
    }

    useEffect(() => {
        if (pathname.toLowerCase().includes("home")) {
            setOption("conversations")
            setShow(false)
        }
        if (pathname.toLowerCase() === "/users") {
            setOption("allUsers")
            if (tempData.length > 0) {
                setOnSearchOnlineUser([])
                setTempData([])
            }
            setShow(false)
        }
        if (pathname.toLowerCase() === "/online") {
            setOption("onlineUsers")
            if (tempData.length > 0) {
                setAllUsers([...tempData])
                setTempData([])
            }
            setShow(false)
        }
    }, [pathname])


    const handleSearch = async () => {
        setLoading(true)
        if (option === "conversations") {
            try {
                if (tempData.length === 0) {
                    setTempData([...conversationsData])
                }
                const res = await axios.get(`${Api_Url}/conversations/search/${Me.id}?username=${value}`)
                console.log(res)
                setConversationsData([...res.data.data])
            } catch (error) {
                console.log("Api Error in Search Conversations:", error)
                setLoading(false)
                return error;
            }
        }
        if (option === "allUsers") {
            try {
                setSameUser(false)
                setTempData([...allUsers])
                const res = await axios.get(`${Api_Url}/users/${value}`)
                console.log(res.data.data)
                const data = [...res.data.data].filter((item: any) => item.id !== Me.id)
                const isMeAvailabe = [...res.data.data].filter((item: any) => item.id === Me.id);
                if (isMeAvailabe.length !== 0) {
                    setSameUser(true)
                }
                setAllUsers([...data])
            } catch (error) {
                console.log("Api Error in Search allUsers:", error)
                setLoading(false)
                return error;
            }
        }
        if (option === "onlineUsers") {
            try {
                setOnSearchOnline(true)
                setSameOnline(false)
                setTempData([...onlineUsers])
                const searchData = onlineUsers.filter((item: any) => item.username.includes(value))
                if (value.toLowerCase().includes(`${Me.username.toLowerCase()}`)) {
                    setSameOnline(true)
                }
                setOnSearchOnlineUser([...searchData])
            } catch (error) {
                console.log("Api Error in Search onlineUsers:", error)
                setLoading(false)
                return error;
            }
        }
        setLoading(false)
    }

    const returnDataToNormal = async () => {
        if (option === "conversations") {
            try {
                setConversationsData([...tempData])
                setTempData([])
            } catch (error) {
                console.log("Api Error in Search Conversations:", error)
                return error;
            }
        }
        if (option === "allUsers") {
            try {
                setAllUsers([...tempData])
                setTempData([])
                setSameUser(true)
            } catch (error) {
                console.log("Api Error in Search allUsers:", error)
                return error;
            }
        }
        if (option === "onlineUsers") {
            try {
                setOnSearchOnlineUser([])
                setTempData([])
                setSameOnline(true)
                setOnSearchOnline(false)
            } catch (error) {
                console.log("Api Error in Search onlineUsers:", error)
                return error;
            }
        }
    }

    return (
        <div className="z-[2] pb-[1rem] pt-[1rem] sm:pt-0 px-[.5rem] sm:px-0  sm:border-none bg-body sm:bg-transparent justify-end w-full flex sm:hidden relative">
            {(pathname.includes("Users") || pathname.includes("Online")) && (
                <div className="grid grid-cols-2 absolute left-0 w-full top-[100%] text-[1.2rem] font-[600] bg-body text-white mt-[-10px]">
                    <div className={`absolute top-[calc(100%-3px)] h-[3px] w-[50%] bg-main-purple duration-300 ${pathname.toLowerCase() === "/users" && "left-0"} ${pathname.toLowerCase() === "/online" && "left-[50%]"}`} />
                    <Link to="/Users" className="flex justify-center items-center gap-[.3rem] pb-[.8rem]">
                        Users <span className="text-[.8rem]">({allUsersLength})</span>
                    </Link>
                    <Link to="/Online" className="flex justify-center items-center gap-[.3rem] pb-[.8rem]">
                        Online <span className="text-[.8rem]">({onlineUsers && onlineUsers.length + 1})</span>
                    </Link>
                </div>
            )}
            <form className={`${show ? "w-full" : "w-[0]"} relative flex justify-center items-center overflow-hidden duration-500`}
                onSubmit={(e) => { e.preventDefault(); handleSearch() }}
            >
                <input type="text" ref={input} className={`bg-white sm:bg-main-search text-[1rem] sm:text-[.8rem] py-[1rem] sm:py-[.5rem] ${show ? "pl-[3rem] pr-[1rem]" : "pl-[3rem] pr-[0]"}  sm:pl-[2rem]  w-full rounded-[2rem] sm:rounded-[.5rem] outline-none`} placeholder="Searching..."
                    value={value} onChange={(e) => setValue(e.target.value)}
                />
                {show &&
                    <button className="absolute right-[1rem] sm:left-2 text-[1.5rem] sm:text-[1.2rem] select-none cursor-pointer hover:bg-text-gray flex justify-center items-center rounded-full p-[.5rem] duration-200">
                        <i className='bx bx-search '></i>
                    </button>
                }
                {show &&
                    <div className="absolute left-[.5rem] sm:left-2 text-[1.5rem] sm:text-[1.2rem] select-none cursor-pointer hover:bg-text-gray flex justify-center items-center rounded-full p-[.5rem] duration-200"
                        onClick={() => {
                            setTimeout(() => {
                                setShow(false)
                            }, 200);
                            returnDataToNormal();
                        }}
                    >
                        <i className='bx bx-arrow-back' />
                    </div>
                }

            </form>
            {!show &&
                <div className="flex w-full justify-between items-center">
                    <div className="text-white text-[1.5rem] ml-[.5rem]">
                        ChatApp
                    </div>
                    <div className="flex justify-center items-center hover:bg-text-gray duration-200 p-[.5rem] rounded-full"
                        onClick={() => handleShowSearch()}
                    >
                        <i className='bx bx-search text-white text-[2rem] select-none cursor-pointer'></i>
                    </div>
                </div>
            }
        </div>
    )
}