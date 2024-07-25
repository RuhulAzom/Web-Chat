import "./loadingSearch.css"


export default function LoadingSearch({ text }: any) {
    return (
        <div className="flex flex-col gap-[0] items-center">
            <h1 className="font-[500] text-[1rem]">
                {text}
            </h1>
            <div className="loadingSearch"><div></div><div></div><div></div><div></div></div>
        </div>
    )
} 