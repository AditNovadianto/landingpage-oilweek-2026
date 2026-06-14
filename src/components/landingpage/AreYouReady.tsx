import { ArrowRight } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react";
import { Link } from "react-router-dom";

const AreYouReady = () => {
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            easing: "ease-in-out",
        });
    }, []);

    return (
        <div className="px-5 md:px-20 lg:px-32 pb-10 mt-32 md:mt-0 md:min-h-screen flex flex-col items-center justify-center">
            <p
                className="text-3xl lg:text-5xl font-inter font-light text-white text-center"
                data-aos="fade-up"
            >
                Are You <span className="font-bold">Ready</span> to <span className="bg-linear-to-l from-yellow-400 to-yellow-100 bg-clip-text text-transparent font-semibold italic font-garamond">#Lead The Shift</span> <span className="font-bold">?</span>
            </p>

            <p
                className="mt-10 font-montreal text-white text-lg md:text-2xl lg:text-3xl text-center"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                Compete, collaborate, and take your place among future leaders as you push <br />your limits and fight your way to the top!
            </p>

            <Link to={'/sign-up'}
                className="font-montreal mt-10 cursor-pointer flex items-center gap-2 glass px-12 py-2 text-white"
                data-aos="zoom-in"
                data-aos-delay="400"
            >
                Register Now

                <ArrowRight />
            </Link>
        </div>
    )
}

export default AreYouReady