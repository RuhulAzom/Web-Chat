import { toast } from "react-toastify"
import Logo from "../../assets/logo.png"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { checkImageSize } from "../../Utils/function"
import ImageType from "../../SubComponent/Image"


import { createClient } from '@supabase/supabase-js'
import { Api_Url, Image_Url, SupabaseKey, SupabaseUrl } from "../../env"
import axios from "axios"
import LoadingFullscreen from "../../SubComponent/Loading/loadingFullscreen"

// Create a single supabase client for interacting with your database
const supabase = createClient(SupabaseUrl, SupabaseKey)

export default function SignUp() {

    const [loading, setLoading] = useState<boolean>(false)

    const [imagePreview, setImagePreview] = useState<string>("")
    const [showPw, setShowPw] = useState<boolean>(false)

    const [image, setImage] = useState<File>()
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [typeImage, setTypeImage] = useState<string>("");


    // API Register
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (image) {
                const { data, error }: any = await supabase
                    .storage
                    .from('myStorage')
                    .upload(`ChatApp_Users/${email}-${username}`, image)
                if (data) {
                    const res = await axios.post(`${Api_Url}/auth/register`, {
                        username,
                        email,
                        password,
                        image: `${Image_Url}/${email}-${username}`
                    })
                    setLoading(false)
                    toast.success("Succesfully created account, Login now", { theme: "colored" })
                    return res;
                }
                if (error) {
                    if (error.statusCode === "409") {
                        const { data, error } = await supabase
                            .storage
                            .from('myStorage')
                            .upload(`ChatApp_Users/${email}-${username}`, image, { upsert: true })
                        if (data) {
                            const res = await axios.post(`${Api_Url}/auth/register`, {
                                username,
                                email,
                                password,
                                image: `${Image_Url}/${email}-${username}`
                            })
                            setLoading(false)
                            toast.success("Succesfully created account, Login now", { theme: "colored" })
                            return res;
                        }
                        if (error) {
                            setLoading(false)
                            console.log(error)
                            toast.error("Failed to create an account, try again later", { theme: "colored" })
                        }
                    }
                    setLoading(false)
                    toast.error("Failed to create an account, try again later", { theme: "colored" })
                }
            }
        } catch (error) {
            console.log("Api Error Register:", error)
            setLoading(false)
            return error;
        }
    }

    // Image Preview
    const handlePreview = async () => {
        if (image) {
            const blob = new Blob([image], { type: image.type })
            const blobUrl = URL.createObjectURL(blob)
            setImagePreview(blobUrl)
            console.log(await checkImageSize(blobUrl))
            const type = await checkImageSize(blobUrl)
            if (type) {
                setTypeImage(type)
            }
        }
    }
    useEffect(() => {
        handlePreview()
    }, [image])

    console.log(typeImage)

    return (
        <div className="bg-body shadow-auth pt-[2rem] pb-[1rem] px-[2rem] w-[330px] sm:w-[400px] rounded-[1rem] overflow-hidden md:relative">

            {loading &&
                <LoadingFullscreen />
            }

            <div className="flex justify-center items-center py-[2rem] select-none">
                <div className="w-[8rem] hue-rotate-[193deg] saturate-[8]">
                    <img src={Logo} alt="" className="w-full h-auto" />
                </div>
            </div>
            <form className="flex flex-col gap-2" onSubmit={(e) => handleSubmit(e)}>
                <div id="preview" className="flex relative gap-4 justify-start items-center">
                    <div className="relative w-[3rem] h-[3rem] border flex justify-center items-center border-white overflow-hidden rounded-full bg-white cursor-pointer hover:bg-[#d3d3d3]"
                        onClick={() => {
                            document.getElementById("inputImage")?.click()
                        }}
                    >
                        {imagePreview === "" &&
                            <div className=" flex flex-col w-fit h-fit items-center">
                                <i className='bx bxs-cloud-upload text-black text-[1.5rem] w-fit' ></i>
                                <p className="text-[.5rem] text-black">Upload</p>
                            </div>
                        }
                        {/* <img src={imagePreview} alt="" /> */}
                        {typeImage !== "" &&
                            <ImageType src={imagePreview} type={typeImage} />
                        }
                    </div>
                    <div className="">
                        <p>{username.length > 0 ? username : "Your name....."}</p>
                        <p className="text-text-gray text-[.8rem]">{email}</p>
                    </div>
                    <input id="inputImage" type="file" className="absolute w-0 h-0 top-0 left-0" required onChange={(e: any) => setImage(e.target.files[0])} />
                </div>
                <div id="username" className="flex justify-center items-center gap-4">
                    <i className='bx bxs-id-card text-[1.5rem] text-main-purple' ></i>
                    <input type="text" placeholder="Username..." className="py-[.3rem] text-[#d8d8d8] bg-transparent outline-none text-[.8rem] w-full border-b border-[#d8d8d8]" required onChange={(e: any) => setUsername(e.target.value)} value={username} />
                </div>
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
                <div className="mt-[2rem] pl-[2.5rem] flex flex-col justify-start items-start gap-[.5rem]">
                    <button className="tracking-[3px] hover:text-main-purple" type="submit"
                        onClick={() => {
                            if (imagePreview == "") {
                                toast.info("Image Profile is Empty", { theme: "colored" })
                            }
                        }}
                    >
                        SIGN UP
                    </button>
                    <button className="text-[.8rem] text-[#d8d8d8] mt-[2rem]">
                        Already have account? <Link to={"/"} className="hover:underline text-main-purple">Login</Link>
                    </button>
                </div>
            </form>
            <div id="waves" className="text-[.8rem] flex justify-center text-center pb-[6rem] ml-[-2rem] mr-[-2rem] mb-[-1rem]">
                <div className="w-[250px] pb-[1rem] ">By logging in you are agree to our privacy policy & terms of service</div>
            </div>
        </div>
    )
}