import "./loadingSearchMobile.css"


export default function LoadingSearchMobile() {
    return (
        <div className="flex flex-col gap-[0] items-center">
            <h1 className="font-[500] text-[1.3rem]">
                Searching User
            </h1>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
} 