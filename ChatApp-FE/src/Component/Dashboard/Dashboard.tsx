import { Link, useLocation } from "react-router-dom"
import Logo from "../../assets/logo.png"
import Cookie from "js-cookie";
import ImageType from "../../SubComponent/Image";
import { getUserData } from "../../Utils/help";
import { useContext } from "react";
import { AppContexts } from "../../ShareComponent";

export default function Dashboard() {

    const { pathname } = useLocation()
    const userData = getUserData()

    const { conversationsLength, onlineUsers } = useContext(AppContexts)

    const logOut = () => {
        // socket?.emit("disconnect", {})
        Cookie.remove("token");
        Cookie.remove("user_data");
        window.location.href = "/"
    }

    return (
        <>
            <div className="sm:h-[10rem] flex justify-center items-center">
                <div className="w-[3.5rem] mt-[-1rem] hue-rotate-[193deg] saturate-[8]">
                    <img src={Logo} alt="" className="w-full h-auto" />
                </div>
            </div>
            <div className="h-full gap-2 sm:gap-0 flex sm:block">
                <div className="flex sm:flex-col gap-2 w-full">
                    <Link to={"/Home"} id="item" className={`shrink-0 w-[66px] sm:w-[unset] duration-200 flex flex-col items-center justify-center p-[1rem] rounded-[1rem] cursor-pointer sm:hover:bg-body-hover`}>
                        <div className=" relative">
                            <i className={`bx bxs-chat text-[1.8rem] ${pathname.toLowerCase() === "/home" ? "text-white" : " text-text-gray"}`} ></i>
                            <div className="absolute top-[-.6rem] right-[-.6rem] bg-main-red text-[.8rem] w-[1.3rem] h-[1.3rem] flex justify-center items-center rounded-full select-none">
                                <p>{conversationsLength}</p>
                            </div>
                        </div>
                        <p id="heading" className={`text-[.8rem] text-text-gray select-none ${pathname.toLowerCase() === "/home" ? "text-white" : " text-text-gray"}`}>Chats</p>
                    </Link>
                    <Link to={"/Users"} id="item" className={`shrink-0 w-[66px] sm:w-[unset] duration-200 flex flex-col items-center justify-center p-[1rem] rounded-[1rem] cursor-pointer sm:hover:bg-body-hover md:hidden`}>
                        <div className=" relative">
                            <i className={`bx bxs-user text-[1.8rem] text-text-gray ${pathname.toLowerCase() === "/users" || pathname.toLowerCase() === "/online" ? "text-white" : " text-text-gray"}`}></i>
                            <div className="absolute top-[-.6rem] right-[-.6rem] bg-main-red text-[.8rem] w-[1.3rem] h-[1.3rem] flex justify-center items-center rounded-full select-none">
                                <p>{onlineUsers?.length + 1}</p>
                            </div>
                        </div>
                        <p id="heading" className={`text-[.8rem] text-text-gray select-none ${pathname.toLowerCase() === "/users" || pathname.toLowerCase() === "/online" ? "text-white" : " text-text-gray"}`}>Users</p>
                    </Link>
                </div>
                <div id="line" className="w-full hidden sm:block h-[1px] bg-text-gray my-[1rem]" />
                <div className="flex flex-col gap-2">
                    <Link to={"/Account"} id="item" className="w-[66px] sm:w-[unset] duration-200 flex flex-col gap-[.5rem] items-center justify-center p-[1rem] rounded-[1rem] cursor-pointer sm:hover:bg-body-hover">
                        {/* <div className=" relative">
                            <i className={`bx bxs-cog text-[1.8rem] text-text-gray ${pathname.toLowerCase() === "/settings" ? "text-white" : " text-text-gray"}`} ></i>
                        </div> */}
                        <div className="w-[25px] h-[25px] bg-white border border-main-border-gray flex justify-center items-center rounded-[50%] overflow-hidden">
                            <ImageType src={userData.image} url={userData.image} />
                        </div>
                        <p id="heading" className={`text-[.8rem] text-text-gray select-none ${pathname.toLowerCase() === "/account" ? "text-white" : " text-text-gray"}`}>Account</p>
                    </Link>
                </div>
            </div>
            <div className="">
                <div id="item" className="flex flex-col items-center justify-center p-[1rem] rounded-[1rem] cursor-pointer sm:hover:bg-body-hover"
                    onClick={() => logOut()}
                >
                    <i className='bx bx-log-out-circle  text-[1.8rem] text-text-gray' ></i>
                    <p id="heading" className="text-[.8rem] text-text-gray">Logout</p>
                </div>
            </div>
        </>
    )
}