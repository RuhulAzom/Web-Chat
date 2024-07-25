import { useEffect, useState } from "react"
import { checkImageSize } from "../Utils/function"


export default function ImageType({ url, src, type }: { url?: string, src: string, type?: string }) {

    const [typeImage, setTypeImage] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const first = async () => {
        setLoading(true)
        try {
            if (url) {
                const data = await checkImageSize(url);
                if (data) {
                    setTypeImage(data)
                }
                setLoading(false)
            } else {
                if (type) {
                    setTypeImage(type)
                }
                setLoading(false)
            }
        } catch (error) {
            console.log("Failed to get image:", error)
            return error;
        }
    }
    useEffect(() => {
        first()
    }, [typeImage])

    return (
        <>
            {!loading ?
                <>
                    {typeImage !== "" &&
                        <img src={src} alt="" className={`
            ${typeImage === "square" ? "w-full h-full" :
                                typeImage === "landscape" ? "w-full h-auto" :
                                    typeImage === "potrait" ? "w-auto h-full" : null}`} />
                    }
                </>
                :
                <div className="w-full h-full bg-[#c9c9c9]"></div>
            }
        </>
    )
}