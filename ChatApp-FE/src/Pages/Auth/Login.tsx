import { toast } from "react-toastify"
import Logo from "../../assets/logo.png"
import { Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { Api_Url } from "../../env";
import Cookie from "js-cookie";
import LoadingFullscreen from "../../SubComponent/Loading/loadingFullscreen"

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPw, setShowPw] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    // API Register
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        try {
            const send = {
                email,
                password
            }
            const res = await axios.post(`${Api_Url}/auth/login`, send)
            console.log(res.data.userData)
            Cookie.set("token", res.data.token, { expires: 1 })
            Cookie.set("user_data", JSON.stringify(res.data.userData), { expires: 1 })

            toast.success(`Succesfully Logged In, redirect to dashboard`, { theme: "colored" })
            setTimeout(() => {
                window.location.pathname = "/Home"
            }, 2000);
            setLoading(false)
            return res;
        } catch (error: any) {
            console.log("Api Error Login:", error)
            setLoading(false)
            toast.error(`${error.response.data.message}`, { theme: "colored" })
            return error;
        }
    }

    return (
        <div className="bg-body shadow-auth pt-[2rem] pb-[1rem] px-[2rem] w-[330px] sm:w-[400px] rounded-[1rem] overflow-hidden md:relative">

            {loading && <LoadingFullscreen />}

            <div className="flex justify-center items-center py-[2rem] select-none">
                <div className="w-[8rem] hue-rotate-[193deg] saturate-[8]">
                    <img src={Logo} alt="" className="w-full h-auto" />
                </div>
            </div>
            <form className="flex flex-col gap-4" onSubmit={(e: any) => handleSubmit(e)}>
                <div id="email" className="flex justify-center items-center gap-4">
                    <i className='bx bxs-user text-[1.5rem] text-main-purple' ></i>
                    <input type="email" placeholder="Email..." className="py-[.3rem] text-[#d8d8d8] bg-transparent outline-none text-[.8rem] w-full border-b border-[#d8d8d8]" required onChange={(e: any) => setEmail(e.target.value)} value={email} />
                </div>
                <div id="password" className="flex justify-center items-center gap-4">
                    <i className='bx bxs-key text-[1.5rem] text-main-purple' ></i>
                    <div className="relative w-full flex items-center">
                        <input type={`${!showPw ? "password" : "text"}`} placeholder="Password..." className="py-[.3rem] text-[#d8d8d8] bg-transparent outline-none text-[.8rem] w-full border-b border-[#d8d8d8]" required onChange={(e: any) => setPassword(e.target.value)} value={password} />
                        <i className={`bx ${!showPw ? "bxs-hide" : "bxs-show"} absolute right-[.5rem] cursor-pointer`}
                            onClick={() => setShowPw(!showPw)}
                        ></i>
                    </div>
                </div>
                <div className="mt-[3rem] pl-[2.5rem] flex flex-col justify-start items-start gap-[.5rem]">
                    <button className="tracking-[3px] hover:text-main-purple">
                        LOGIN
                    </button>
                    <button className="text-[.8rem] text-text-gray underline hover:text-[#ffffff9f]">
                        FORGOT PASSWORD?
                    </button>
                    <button className="text-[.8rem] text-[#d8d8d8] mt-[2rem]">
                        Not have account? <Link to={"/SignUp"} className="hover:underline text-main-purple">SignUp</Link>
                    </button>
                </div>
            </form>
            <div id="waves" className="text-[.8rem] flex justify-center text-center pb-[6rem] ml-[-2rem] mr-[-2rem] mb-[-1rem]">
                <div className="w-[250px] pb-[1rem] ">By logging in you are agree to our privacy policy & terms of service</div>
            </div>
        </div>
    )
}