import { useContext, useEffect, useState } from "react";
import HeaderMobile from "../../SubComponent/HeaderMobile";
import axios from "axios";
import { Api_Url } from "../../env";
import { getUserData } from "../../Utils/help";
import { AppContexts } from "../../ShareComponent";


export default function SearchConversations({ setLoadingSearch }: any) {

    const userData = getUserData()

    const { conversationsData, setConversationsData } = useContext(AppContexts)

    const [value, setValue] = useState<string>("")
    const [tempData, setTempData] = useState<any>([])

    const handleSearchConversations = async () => {
        setLoadingSearch(true)
        try {
            if (tempData.length === 0) {
                setTempData([...conversationsData])
            }
            const res = await axios.get(`${Api_Url}/conversations/search/${userData.id}?username=${value}`)
            console.log(res)
            setConversationsData([...res.data.data])
            setLoadingSearch(false)
            return res;
        } catch (error) {
            console.log("Api Error in Search Conversations:", error);
            setLoadingSearch(false)
            return error;
        }
    }

    useEffect(() => {
        if (value.length === 0 && tempData.length > 0) {
            setConversationsData([...tempData])
            setTempData([])
        }
    }, [value])

    return (
        <>
            <form className="z-[2] pb-[1rem] pt-[1rem] sm:pt-0 px-[.5rem] sm:px-0 border-b border-main-border-gray sm:border-none bg-body sm:bg-transparent hidden sm:block"
                onSubmit={(e) => { e.preventDefault(); document.getElementById("searchConversations")?.click() }}
            >
                <div className=" relative flex justify-center items-center">
                    <input type="text" className="bg-white sm:bg-main-search text-[1rem] sm:text-[.8rem] py-[1rem] sm:py-[.5rem] pl-[3rem] sm:pl-[2rem] pr-[1rem] w-full rounded-[2rem] outline-none" placeholder="Searching..."
                        onChange={(e) => setValue(e.target.value)} value={value}
                    />
                    <i id="searchConversations" className='bx bx-search absolute left-[1rem] sm:left-2 text-[1.5rem] sm:text-[1.2rem] select-none cursor-pointer'
                        onClick={handleSearchConversations}
                    />
                </div>
            </form>

            {/* Mobile */}
            <HeaderMobile setLoading={setLoadingSearch} />
        </>
    )
}