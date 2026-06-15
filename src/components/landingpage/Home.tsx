import { ArrowRight } from "lucide-react"
import logoOw from "../../images/Logo-ow.png"
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

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
                <h1 data-aos="fade-up" data-aos-delay="100" className="font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-16 font-montreal">Empowering Sustainable Growth Through <span className="font-garamond italic bg-linear-to-b from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent">Industry Optimization & Low Carbon</span> Transition <span className="m-auto inline-block align-middle w-52 h-1 bg-linear-to-b from-yellow-400 via-yellow-200 to-white"></span></h1>

                <div data-aos="fade-up" data-aos-delay="400" className="mt-10 flex flex-col md:flex-row items-start gap-5">
                    <Link to={'/team-leader/sign-up'} data-aos="zoom-in" data-aos-delay="500" className="cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                        Register Now

                        <ArrowRight />
                    </Link>

                    <a data-aos="zoom-in" data-aos-delay="700" href="#competitions" className="cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white">
                        Explore Competition

                        <ArrowRight />
                    </a>
                </div>

                <p data-aos="fade-right" data-aos-delay="900" className="text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-garamond"><span className="font-garamond">#</span>Lead<span className="font-light font-inter">The</span><span className="font-garamond italic font-bold">Shift</span></p>
            </div>

            <div>
                <img data-aos="zoom-in" data-aos-delay="300" data-aos-duration="1500" className="w-[80%] animate-pulse m-auto md:w-125" src={logoOw} alt="Logo" />

                <p data-aos="fade-up" data-aos-delay="800" className="text-center text-white text-3xl mt-5 font-montreal"><span className="font-bold">Oil</span> <span className="italic">Week</span> <span className="text-2xl">2026</span></p>
            </div>
        </div>
    )
}

export default Home