import "./loading.css"
export default function LoadingFullscreen() {
    return (
        <div id="loading" className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000009d] z-[10] flex justify-center items-center">
            <div className="lds-ring text-main-purple box-border inline-block relative w-[80px] h-[80px]">
                <div className="box-border block absolute w-[64px] h-[64px] m-[8px] border-[8px] border-solid border-[currentColor] rounded-[50%] border-t-[currentColor] border-r-[transparent] border-b-[transparent] border-l-[transparent]"></div>
                <div className="box-border block absolute w-[64px] h-[64px] m-[8px] border-[8px] border-solid border-[currentColor] rounded-[50%] border-t-[currentColor] border-r-[transparent] border-b-[transparent] border-l-[transparent]"></div>
                <div className="box-border block absolute w-[64px] h-[64px] m-[8px] border-[8px] border-solid border-[currentColor] rounded-[50%] border-t-[currentColor] border-r-[transparent] border-b-[transparent] border-l-[transparent]"></div>
                <div className="box-border block absolute w-[64px] h-[64px] m-[8px] border-[8px] border-solid border-[currentColor] rounded-[50%] border-t-[currentColor] border-r-[transparent] border-b-[transparent] border-l-[transparent]"></div>
            </div>
        </div>
    )
}