import { useEffect, useState } from "react"
import logo from "../images/logo.png"
import AOS from "aos"
import "aos/dist/aos.css"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [showNavbar, setShowNavbar] = useState(false)

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: "ease-in-out",
        });

        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <div
                data-aos="fade-down"
                className={`fixed top-0 px-5 md:px-10 lg:px-20 flex items-center gap-5 justify-between w-full transition-all duration-300 z-50
            ${scrolled ? "bg-white/10 py-3 backdrop-blur-xl border-b border-white/20 shadow-lg" : "py-5 bg-transparent"}
            `}
            >
                <a href="#">
                    <img data-aos="zoom-in" data-aos-delay="200" className="cursor-pointer w-14" src={logo} alt="Logo" />
                </a>

                <div className="flex items-center gap-10 font-inter text-white font-light">
                    <a data-aos="fade-down" data-aos-delay="300" className="hidden lg:block" href="#home">Home</a>
                    <a data-aos="fade-down" data-aos-delay="400" className="hidden lg:block" href="#aboutspeuisc">About SPE UI SC</a>
                    <a data-aos="fade-down" data-aos-delay="500" className="hidden lg:block" href="#aboutoilweek">About Oil Week</a>
                    <a data-aos="fade-down" data-aos-delay="600" className="hidden lg:block" href="#competitions">Competititons</a>
                    <a data-aos="fade-down" data-aos-delay="700" className="hidden lg:block" href="#contact">Contact</a>

                    <button data-aos="zoom-in" data-aos-delay="800" className="glass hidden lg:block px-7 py-2 cursor-pointer">Login</button>
                </div>

                <button
                    className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-2"
                    onClick={() => setShowNavbar(!showNavbar)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${showNavbar ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${showNavbar ? "opacity-0" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${showNavbar ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            <div
                className={`z-10 fixed top-20 w-full lg:hidden overflow-hidden transition-all duration-300 ${showNavbar ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="flex flex-col px-6 py-6 gap-5 font-inter text-white font-light bg-white/10 backdrop-blur-xl">
                    <a href="#home" onClick={() => setShowNavbar(false)}>Home</a>
                    <a href="#aboutspeuisc" onClick={() => setShowNavbar(false)}>About SPE UI SC</a>
                    <a href="#aboutoilweek" onClick={() => setShowNavbar(false)}>About Oil Week</a>
                    <a href="#competitions" onClick={() => setShowNavbar(false)}>Competititons</a>
                    <a href="#contact" onClick={() => setShowNavbar(false)}>Contact</a>
                    <button className="glass px-7 py-2 cursor-pointer w-fit">Login</button>
                </div>
            </div>
        </>
    )
}

export default Navbar