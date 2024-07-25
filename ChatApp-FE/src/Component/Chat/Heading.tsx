import menu from "../../assets/icon/menu.png";
import search from "../../assets/icon/search.png";
import phone from "../../assets/icon/Phone.png";
import { useNavigate } from "react-router-dom";
import ImageType from "../../SubComponent/Image";

export default function Heading({ receiver, loading }: any) {

    const navigate = useNavigate();

    const back = () => {
        setTimeout(() => {
            navigate("/Home")
        }, 100);
    }

    // console.log("receiver:", receiver)
    return (
        <>
            <div className="hidden sm:block">
                {!loading ?
                    <>
                        <h1 className="text-[1.5rem] sm:text-[2rem] font-[700] capitalize">
                            {receiver.username}
                        </h1>
                        <p className="text-text-gray">Online</p>
                    </>
                    :
                    <>
                        <h1 id="Loading" className="text-[1.2rem] mb-[.3rem] sm:text-[2rem] w-[300px] font-[700] rounded-[.8rem]">
                            Loading...
                        </h1>
                        <p id="Loading" className="text-text-gray w-[150px] rounded-[.6rem]">Loading...</p>
                    </>
                }
            </div>

            {/* Mobile */}
            {!loading &&
                <div className="flex items-center justify-start gap-4 sm:hidden">
                    <div className="flex justify-center items-center hover:bg-text-gray p-[.5rem] duration-300 rounded-full"
                        onClick={() => back()}
                    >
                        <i className='bx bx-arrow-back text-[2rem] cursor-pointer'></i>
                    </div>
                    <div className="w-[2.8rem] h-[2.8rem] rounded-full overflow-hidden flex justify-center items-center border border-main-border-gray bg-white">
                        {/* <img src={receiver.image} alt="" className="w-full h-auto" /> */}
                        <ImageType src={receiver.image} url={receiver.image} />
                    </div>
                    <div className="">
                        <h1 className="text-[1.3rem] sm:text-[2rem] font-[400] sm:font-[700] whitespace-nowrap">
                            {receiver.username.length > 10 ? `${receiver.username.slice(0, 10)}...` : receiver.username}
                        </h1>
                        {receiver.online ?
                            <p className="text-green-500">Online</p>
                            :
                            <p className="text-text-gray">Offline</p>
                        }
                    </div>
                </div>
            }
            {loading &&
                <div className="flex items-center justify-start gap-4 sm:hidden">
                    <div className="flex justify-center items-center hover:bg-text-gray p-[.5rem] duration-300 rounded-full"
                        onClick={() => back()}
                    >
                        <i className='bx bx-arrow-back text-[2rem] cursor-pointer'></i>
                    </div>
                    <div id="Loading" className="w-[2.8rem] h-[2.8rem] rounded-full overflow-hidden flex justify-center items-center bg-white">
                    </div>
                    <div className="">
                        <h1 id="Loading" className="text-[1.3rem] mb-[.2rem] sm:text-[2rem] font-[700] rounded-[.3rem]">
                            ahdwaoi dwoaijdaw adw
                        </h1>
                        <p id="Loading" className="text-transparent text-[.8rem] w-[100px] rounded-[.3rem]">Online</p>
                    </div>
                </div>
            }

            <div className="flex justify-end items-center sm:items-start gap-[1rem]">
                <div className="w-[2.5rem] select-none cursor-pointer hidden sm:block">
                    <img src={search} alt="" className="w-full h-auto" />
                </div>
                <div className="w-[2.5rem] select-none cursor-pointer hidden sm:block">
                    <img src={phone} alt="" className="w-full h-auto" />
                </div>
                <div className="w-[2.5rem] select-none cursor-pointer ">
                    <img src={menu} alt="" className="w-full h-auto" />
                </div>
            </div>
        </>
    )
}