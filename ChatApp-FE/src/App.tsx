import { useLocation, useNavigate } from 'react-router-dom'
import Layout from './Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Cookie from "js-cookie";
import ShareComponent from './ShareComponent';

function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookie.get("token");
    if (!token) {
      if (pathname.toLowerCase() !== "/" && pathname.toLowerCase() !== "/signup") {
        navigate("/")
      }
    } else {
      if (pathname.toLowerCase() === "/") {
        navigate("/Home")
      }
      if (pathname.toLowerCase() === "/signup") {
        navigate("/Home")
      }
    }

  }, [])

  return (
    <>
      <ToastContainer />
      <ShareComponent>
        <Layout />
      </ShareComponent>
    </>
  )
}

export default App
