import { ArrowRight } from "lucide-react"

const AreYouReady = () => {
    return (
        <div className="px-5 md:px-20 lg:px-32 pb-10 mt-32 md:mt-0 md:min-h-screen flex flex-col items-center justify-center">
            <p className="text-3xl lg:text-5xl font-inter font-light text-white text-center">Are You <span className="font-bold">Ready</span> to <span className="italic font-garamond text-[#E7C66B] font-semibold">#Lead The Shift</span> <span className="font-bold">?</span></p>

            <p className="mt-10 font-inter font-light text-white text-lg md:text-2xl lg:text-3xl text-center">Compete, collaborate, and take your place among future leaders as you push your limits and fight your way to the top!</p>

            <button className="mt-10 cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                Register Now

                <ArrowRight />
            </button>
        </div>
    )
}

export default AreYouReady