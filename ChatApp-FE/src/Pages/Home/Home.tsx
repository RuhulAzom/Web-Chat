import { useParams } from "react-router-dom";
import Chat from "../../Component/Chat/Chat";
import Conversations from "../../Component/Conversations.tsx/Coversations";
import User from "../../Component/User/User";
import { useEffect } from "react";


export default function Home({ setHideDashboar, receiver, setReceiver }: any) {

    const { chat } = useParams()



    useEffect(() => {
        if (chat) {
            setHideDashboar(true)
        } else {
            setHideDashboar(false)
        }
    }, [chat])

    return (
        <>
            <div className="bg-transparent h-full py-[.5rem] w-full hidden sm:block">
                <div className="bg-white flex h-full rounded-[2rem] pl-[1.5rem] ">
                    <Conversations setReceiver={setReceiver} />
                    <Chat receiver={receiver} setReceiver={setReceiver} />
                </div>
            </div>

            {chat ?
                <div className="block sm:hidden">
                    <Chat receiver={receiver} setReceiver={setReceiver} />
                </div>
                :
                // Mobile Version
                <div className="bg-transparent h-full py-0 sm:py-[.5rem] w-full block sm:hidden">
                    <div className="bg-white flex h-full sm:rounded-[2rem] sm:pr-0 sm:pl-[1.5rem]">
                        <Conversations setReceiver={setReceiver} />
                    </div>
                </div>
            }


            <div id="User" className="ml-2 grid-cols-1 grid-rows-2 gap-[.5rem] bg-transparent h-full py-[.5rem] w-[350px] hidden lg:grid">
                <User setReceiver={setReceiver} />
            </div>
        </>
    )
}