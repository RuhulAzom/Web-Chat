import { useState } from "react";
import ImageType from "../../SubComponent/Image";
import { getDate } from "../../Utils/function";
import { getUserData } from "../../Utils/help";


export default function Account() {

    const userData = getUserData()

    const [edit, setEdit] = useState<boolean>(false)
    const [username, setUsername] = useState<string>(`${userData.username}`)
    const [email, setEmail] = useState<string>(`${userData.email}`)

    console.log(userData)

    return (
        <div className="bg-transparent h-full py-[.5rem] w-full">
            <div id="account" className="bg-blue-500 flex items-center h-full text-black rounded-[2rem] overflow-hidden relative px-[2rem]">
                <div className="absolute bg-[#0000007c] top-[-1rem] left-[-.5rem] right-[-.5rem] bottom-[-1rem] z-[1]" />
                <div className="flex w-full h-fit pb-[5rem] sm:pb-[10rem] flex-col gap-[1rem]">
                    <div className="w-full flex justify-center bg-transparent z-[2]">
                        <div className="rounded-[50%] w-[10rem] sm:w-[20rem] h-[10rem] sm:h-[20rem] overflow-hidden shrink-0 mb-[-5rem] sm:mb-[-10rem] border border-main-border-gray bg-white flex justify-center items-center">
                            <ImageType src={userData.image} url={userData.image} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[1rem] pt-[5rem] sm:pt-[10rem] p-[2rem] w-full bg-white h-fit rounded-[2rem] z-[1]">
                        <Input heading={"Username"} value={`${username}`} setValue={setUsername} change={edit ? true : false} />
                        <Input heading={"Email"} value={`${email}`} setValue={setEmail} change={edit ? true : false} />
                        <Input heading={"Join"} value={`${getDate(userData.createAt)}`} />
                        {!edit &&
                            <div className="w-fit mt-[1rem] bg-main-purple text-white py-[.5rem] px-[1rem] rounded-[.8rem] cursor-pointer"
                                onClick={() => setEdit(true)}
                            >
                                Edit Profile
                            </div>
                        }
                        {edit &&
                            <div className="flex gap-[.5rem] mt-[1rem]">
                                <button className="w-fit bg-yellow-400 text-white py-[.5rem] px-[1rem] rounded-[.8rem] cursor-pointer"
                                    onClick={() => {
                                        setEdit(false)
                                        setUsername(`${userData.username}`)
                                        setEmail(`${userData.email}`)
                                    }}
                                >
                                    Cancel
                                </button>
                                <button className="w-fit bg-blue-600 text-white py-[.5rem] px-[1rem] rounded-[.8rem] cursor-pointer">
                                    Submit
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export const Input = ({ value, heading, change, setValue }: any) => {
    return (
        <div className="relative">
            <h1 className="absolute left-[1rem] w-fit h-fit top-[-.7rem] bg-white z-[3]">
                {heading}
            </h1>
            {!change &&
                <div className="bg-[#ffffff86] absolute top-0 left-0 w-full h-full z-[2]" />
            }
            {!change ?
                <input type="text" value={value} className="border-[2px] border-main-purple rounded-[.5rem] px-[1rem] py-[.7rem] w-full outline-none bg-[#f9f9f9]" readOnly />
                :
                <input type="text" value={value} className="border-[2px] border-main-purple rounded-[.5rem] px-[1rem] py-[.7rem] w-full outline-none bg-[#fff]" onChange={(e) => setValue(e.target.value)} />
            }
        </div>

    )
}