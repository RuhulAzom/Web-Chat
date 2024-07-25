import axios from "axios";
import { Api_Url } from "../../env";
import { useContext } from "react";
import { getUserData } from "../../Utils/help";
import { useNavigate } from "react-router-dom";
import { AppContexts } from "../../ShareComponent";
import AllUsers from "./AllUsers";
import OnlineUsers from "./OnlineUsers";

export default function User({ setReceiver }: any) {
    const navigate = useNavigate()
    const { setMessage } = useContext(AppContexts)

    const GetConversationByMemberId = async (receiverId: any, dataReceiver: any) => {
        const userData = getUserData()
        if (userData.id === dataReceiver.id) {
            return;
        }
        try {
            const res = await axios.get(`${Api_Url}/conversations/member/user?senderId=${userData.id}&receiverId=${receiverId}`);
            // const data = [...res.data.data];
            if (res.data.status === 200) {
                setReceiver({ ...dataReceiver })
                navigate(`/Home/${res.data.data.id}`)
            }
            return res;
        } catch (error: any) {
            console.log("Api Error in Get All Users:", error)
            if (error.response.status === 404) {
                navigate(`/Home/${dataReceiver.id}`)
                setReceiver({ ...dataReceiver })
                setMessage([])
            }
            return error;
        }
    }

    return (
        <>
            <AllUsers GetConversationByMemberId={GetConversationByMemberId} />
            <OnlineUsers GetConversationByMemberId={GetConversationByMemberId} />
        </>
    )
}

