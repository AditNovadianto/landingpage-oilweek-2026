import { useEffect, useState } from "react"
import logo from "../images/logo.png"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50) // trigger di 50px
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div
            className={`sticky top-0 px-20 flex items-center gap-5 justify-between w-full transition-all duration-300 z-50
            ${scrolled ? "bg-white/10 py-3 backdrop-blur-xl border-b border-white/20 shadow-lg" : "py-5 bg-transparent"}
            `}
        >
            <img className="cursor-pointer w-14" src={logo} alt="Logo" />

            <div className="flex items-center gap-10 font-inter text-white font-light">
                <a href="#home">Home</a>
                <a href="#aboutspeuisc">About SPE UI SC</a>
                <a href="#aboutoilweek">About Oil Week</a>
                <a href="#competitions">Competititons</a>
                <a href="#">Contact</a>

                <button className="glass px-7 py-2 cursor-pointer">Login</button>
            </div>
        </div>
    )
}

export default Navbar