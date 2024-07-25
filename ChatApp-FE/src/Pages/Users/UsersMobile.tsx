
import { useState } from "react";
import HeaderMobile from "../../SubComponent/HeaderMobile";
import UserList from "./UserList";

// Mobile
export default function UsersMobile({ setReceiver }: any) {
    // const [allUsers, setAllUsers] = useState<any>([])
    // const [onlineUsers, setOnlineUsers] = useState<any>([])

    const [loading, setLoading] = useState<boolean>(false)

    return (
        <>
            <div className="text-black grid grid-cols-1 grid-rows-[auto,1fr] w-full sm:w-[400px] h-full py-[unset] sm:py-[1.5rem] pr-0 sm:pr-[.5rem] sm:border-r border-main-border-gray">
                <HeaderMobile setLoading={setLoading} />
                <UserList setReceiver={setReceiver} loading={loading} />
            </div>

        </>
    )
}