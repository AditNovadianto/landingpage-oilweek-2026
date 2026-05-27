import { ArrowRight } from "lucide-react"
import logoOw from "../../images/Logo-ow.png"
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        });
    }, []);

    return (
        <div id="home" className="mt-24 px-5 md:px-20 lg:px-32 py-10 min-h-screen flex flex-col md:flex-row items-center gap-10 justify-between">
            <div>
                <h1 data-aos="fade-up" data-aos-delay="100" className="font-light text-4xl md:text-5xl lg:text-6xl text-white leading-16 font-inter">Empowering Sustainable Growth Through <span className="font-garamond italic">Industry Optimization <span className="font-inter">&</span> Low Carbon</span> Transition</h1>

                <div data-aos="fade-up" data-aos-delay="400" className="mt-10 flex flex-col md:flex-row items-start gap-5">
                    <button data-aos="zoom-in" data-aos-delay="500" className="cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                        Register Now

                        <ArrowRight />
                    </button>

                    <a data-aos="zoom-in" data-aos-delay="700" href="#competitions" className="cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                        Explore Competition

                        <ArrowRight />
                    </a>
                </div>

                <p data-aos="fade-right" data-aos-delay="900" className="text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-garamond"><span className="font-inter">#</span>Lead<span className="font-light font-inter">The</span><span className="font-garamond italic font-bold">Shift</span></p>
            </div>

            <div>
                <img data-aos="zoom-in" data-aos-delay="300" data-aos-duration="1500" className="w-[80%] animate-pulse m-auto md:w-125" src={logoOw} alt="Logo" />

                <p data-aos="fade-up" data-aos-delay="800" className="text-center text-white text-3xl mt-5"><span className="font-bold font-inter">Oil</span> <span className="italic">Week</span> <span className="text-2xl">2026</span></p>
            </div>
        </div>
    )
}

export default Home