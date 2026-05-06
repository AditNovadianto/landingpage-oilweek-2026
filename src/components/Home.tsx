import { ArrowRight } from "lucide-react"
import logoOw from "../images/Logo-ow.png"

const Home = () => {
    return (
        <div id="home" className="px-32 py-10 min-h-screen border border-red-500 flex items-center gap-10 justify-between">
            <div className="">
                <h1 className="font-light text-6xl text-white leading-16 font-inter">Empowering Sustainable Growth Through <span className="font-garamond italic">Industry Optimization <span className="font-inter">&</span> Low Carbon</span> Transition</h1>

                <div className="mt-10 flex items-center gap-5">
                    <button className="cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                        Register Now

                        <ArrowRight />
                    </button>

                    <button className="cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                        Explore Competition

                        <ArrowRight />
                    </button>
                </div>

                <p className="text-4xl text-white mt-10 font-garamond"><span className="font-inter">#</span>Lead<span className="font-light font-inter">The</span><span className="font-garamond italic font-bold">Shift</span></p>
            </div>

            <div>
                <img className="w-125" src={logoOw} alt="Logo" />

                <p className="text-center text-white text-3xl mt-5"><span className="font-bold font-inter">Oil</span> <span className="italic">Week</span> <span className="text-2xl">2026</span></p>
            </div>
        </div>
    )
}

export default Home