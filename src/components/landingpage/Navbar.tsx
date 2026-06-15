import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "../../images/logo.png"
import AOS from "aos"
import "aos/dist/aos.css"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [showNavbar, setShowNavbar] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const navRef = useRef<HTMLDivElement>(null)

    const isHome = location.pathname === "/"

    // Handle klik nav link
    const handleNavClick = (sectionId: string) => {
        setShowNavbar(false)

        if (isHome) {
            // Sudah di home, tinggal scroll ke section
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
        } else {
            // Dari halaman lain → navigate ke home dulu, lalu scroll
            navigate("/", { state: { scrollTo: sectionId } })
        }
    }

    // Setelah landing di Home dari halaman lain, scroll ke section yang dituju
    useEffect(() => {
        if (isHome && location.state?.scrollTo) {
            setTimeout(() => {
                document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: "smooth" })
            }, 100) // sedikit delay biar DOM-nya siap
        }
    }, [isHome, location.state])

    useEffect(() => {
        AOS.init({ duration: 1000, once: true, easing: "ease-in-out" })
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showNavbar && navRef.current && !navRef.current.contains(e.target as Node)) {
                setShowNavbar(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showNavbar])

    return (
        <>
            <div ref={navRef}>
                <div
                    data-aos="fade-down"
                    className={`font-montreal fixed top-0 px-5 md:px-10 lg:px-20 flex items-center gap-5 justify-between w-full transition-all duration-300 z-50
                    ${scrolled ? "bg-white/10 py-3 backdrop-blur-xl border-b border-white/20 shadow-lg" : "py-5 bg-transparent"}
                `}
                >
                    <a href="/">
                        <img data-aos="zoom-in" data-aos-delay="200" className="cursor-pointer w-14" src={logo} alt="Logo" />
                    </a>

                    <div className="flex items-center gap-10 text-white font-normal">
                        <button data-aos="fade-down" data-aos-delay="300" className="hidden lg:block bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("home")}>Home</button>
                        <button data-aos="fade-down" data-aos-delay="400" className="hidden lg:block bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("aboutspeuisc")}>About SPE UI SC</button>
                        <button data-aos="fade-down" data-aos-delay="500" className="hidden lg:block bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("aboutoilweek")}>About Oil Week</button>
                        <button data-aos="fade-down" data-aos-delay="600" className="hidden lg:block bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("competitions")}>Competitions</button>
                        <button data-aos="fade-down" data-aos-delay="700" className="hidden lg:block bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("contact")}>Contact</button>

                        <Link to={'/team-leader/sign-in'} data-aos="zoom-in" data-aos-delay="800" className="glass hidden lg:block px-7 py-2 cursor-pointer">Login</Link>
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

                {/* Mobile menu */}
                <div className={`z-10 font-montreal fixed top-20 w-full lg:hidden overflow-hidden transition-all duration-300 ${showNavbar ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col px-6 py-6 gap-5 text-white font-normal bg-white/10 backdrop-blur-xl">
                        <button className="text-left bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("home")}>Home</button>

                        <button className="text-left bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("aboutspeuisc")}>About SPE UI SC</button>

                        <button className="text-left bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("aboutoilweek")}>About Oil Week</button>

                        <button className="text-left bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("competitions")}>Competitions</button>

                        <button className="text-left bg-transparent border-none cursor-pointer text-white" onClick={() => handleNavClick("contact")}>Contact</button>

                        <Link to={'/team-leader/sign-in'} className="glass px-7 py-2 cursor-pointer w-fit">Login</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar