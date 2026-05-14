import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"

const NotFound = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: "ease-in-out",
        })
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center bg-linear-to-b from-[#091025] to-[#032155]">
            <p
                className="text-8xl md:text-9xl font-bold text-white"
                data-aos="zoom-in"
            >
                404
            </p>

            <p
                className="mt-5 text-3xl md:text-5xl font-inter font-light text-white"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                Page <span className="italic font-garamond font-semibold text-[#E7C66B]">Not Found</span>
            </p>

            <p
                className="mt-5 max-w-2xl text-white font-light text-lg md:text-xl"
                data-aos="fade-up"
                data-aos-delay="400"
            >
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>

            <Link
                to="/"
                className="mt-10 glass px-8 py-3 text-white flex items-center gap-3"
                data-aos="zoom-in"
                data-aos-delay="600"
            >
                <ArrowLeft />
                Back to Home
            </Link>
        </div>
    )
}

export default NotFound