
import Dashboard from "./Component/Dashboard/Dashboard";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { useEffect, useState } from "react";
import Auth from "./Pages/Auth/Auth";
import Cookie from "js-cookie";
import axios from "axios";
import { Api_Url } from "./env";
import UsersMobile from "./Pages/Users/UsersMobile";
import Account from "./Pages/Account";
import PageNotFound from "./Pages/_PageNotFound";




export default function Layout() {

    const { pathname } = useLocation()

    const [isLogin, setIslogin] = useState(false)
    const [receiver, setReceiver] = useState<any>({})

    const checkToken = async (token: string) => {
        try {
            const res = await axios.get(`${Api_Url}/authentication`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                setIslogin(true)
            }
            return res;
        } catch (error: any) {
            console.log("Api Error in Authentication:", error)
            if (error?.response?.status) {
                console.log("Api Error in Authentication:", error?.response?.status)
                Cookie.remove("token");
                window.location.href = "/"
                setIslogin(false)
            }
            return error;
        }
    }

    useEffect(() => {
        const token = Cookie.get("token");
        if (!token) {
            setIslogin(false)
        } else {
            checkToken(token)
        }
    }, [])

    const [hideDashboard, setHideDashboar] = useState<boolean>(false)

    useEffect(() => {
        if (pathname.split("/")[2]) {
            setHideDashboar(true)
        } else {
            setHideDashboar(false)
        }
    }, [pathname])

    return (
        <div className={`max-w-[1920px] mx-auto fixed grid ${hideDashboard ? "grid-rows-1" : " grid-rows-[minmax(0,1fr),79px]"} sm:flex top-0 right-0 left-0 bottom-0 bg-body pl-0 sm:pl-0 pr-0 sm:pr-[.5rem]`}>

            {isLogin &&
                <>
                    {pathname.toLowerCase() !== "/" && pathname.toLowerCase() !== "/signup" &&
                        <>
                            <div id="Dashboard" className=" sm:flex-col shrink-0 text-white sm:h-full justify-between p-[.5rem] w-full sm:w-fit absolute sm:relative bottom-0 left-0 bg-body hidden sm:flex">
                                <Dashboard />
                            </div>

                            {/* Mobile */}
                            {!hideDashboard &&
                                <div id="Dashboard" className="z-[2] flex sm:flex-col shrink-0 text-white sm:h-full justify-between pt-[.5rem] px-[.5rem] w-full sm:w-fit absolute sm:relative bottom-0 left-0 bg-body sm:hidden">
                                    <Dashboard />
                                </div>
                            }
                        </>
                    }
                </>
            }

            <Routes>
                <Route path="*" element={
                    <PageNotFound />
                } />
                {!isLogin &&
                    <>
                        <Route index element={<Auth />} />
                        <Route path="/SignUp" element={<Auth />} />
                    </>
                }
                {isLogin &&
                    <>
                        <Route path='/Home' element={
                            <Home setHideDashboar={setHideDashboar} receiver={receiver} setReceiver={setReceiver} />
                        } />
                        <Route path='/Home/:chat' element={
                            <Home setHideDashboar={setHideDashboar} receiver={receiver} setReceiver={setReceiver} />
                        } />
                        <Route path='/Users' element={
                            <>
                                <div className="block sm:hidden" >
                                    <UsersMobile setReceiver={setReceiver} />
                                </div>
                                <div className="hidden sm:block" >
                                    <PageNotFound />
                                </div>
                            </>
                        } />
                        <Route path='/Online' element={
                            <>
                                <div className="block sm:hidden">
                                    <UsersMobile setReceiver={setReceiver} />
                                </div>
                                <div className="hidden sm:block">
                                    <PageNotFound />
                                </div>
                            </>
                        } />
                        <Route path='/Account' element={<Account />} />
                    </>
                }
            </Routes>

        </div>
    )
}