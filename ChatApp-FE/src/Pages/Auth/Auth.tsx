import { useLocation } from "react-router-dom"
import Login from "./Login"
import SignUp from "./SignUp"

export default function Auth() {

    const { pathname } = useLocation()

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center">
            {pathname.toLowerCase() === "/" ?
                <Login />
                :
                <SignUp />
            }
        </div>
    )
}