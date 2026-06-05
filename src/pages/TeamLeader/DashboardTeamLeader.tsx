import { useEffect, useState } from "react"
import Home from "../../components/dashboardTeamLeader/Home"
import useImagePreload from "../../hooks/useImagePreload"
import logoOw from "../../images/Logo-ow.png"
import bg from "../../images/dashboard/bg-dashboard.png"
import { House, LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface User {
    name_team_leader?: string
    email_team_leader?: string
}

const DashboardTeamLeader = () => {
    const bgLoaded = useImagePreload(bg)

    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)
    const [section, setSection] = useState("home")

    useEffect(() => {
        const user = localStorage.getItem("user")
        const userObj = JSON.parse(user || "{}");

        if (user) {
            setUser(userObj)
        } else {
            setUser(null)
        }
    }, [])

    const logOutHandler = () => {
        sessionStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("team")
        localStorage.removeItem("member")

        navigate('/sign-in')
    }

    console.log(section)

    return (
        <div className="min-h-screen w-full flex bg-cover overflow-hidden" style={{ backgroundImage: bgLoaded ? `url(${bg})` : "none", backgroundColor: "#0d1e2e", transition: "background-image 0.3s ease" }}>
            {/* SIDEBAR */}
            <div
                className="h-full group relative flex flex-col justify-between min-h-screen w-24 hover:w-72 transition-all ease-in-out overflow-hidden bg-white/5 backdrop-blur-2xl border-r border-white/10 px-4 py-8 shadow-2xl"
            >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                <div className="relative z-10">
                    {/* LOGO */}
                    <div className="flex items-center justify-center">
                        <img
                            src={logoOw}
                            alt="logo"
                            className="w-14 transition-all group-hover:scale-110 animate-pulse"
                        />
                    </div>

                    {/* PROFILE CARD */}
                    <div className="mt-10 px-3 py-3 flex items-center gap-4 text-white rounded-xl bg-linear-to-t from-[#091025] to-[#032155]">
                        <img src={logoOw} alt="" className="w-7 min-w-7 shrink-0 ml-1" />

                        <div className="opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                            <p className="font-semibold font-inter italic">
                                {user?.name_team_leader}
                            </p>

                            <p className="font-light font-inter italic text-sm">
                                {user?.email_team_leader}
                            </p>
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="mt-10 flex flex-col gap-4">
                        {/* HOME */}
                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "home" ? "bg-white/15 shadow-lg border border-white/10" : "hover:bg-white/10 hover:translate-x-2"}`}
                            onClick={() => setSection("home")}
                        >
                            {/* ACTIVE EFFECT */}
                            {section === "home" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <House
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "home" ? "scale-110 text-cyan-300" : ""}`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap relative z-10"
                            >
                                Home
                            </p>
                        </button>

                        {/* PROFILE */}
                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "profile" ? "bg-white/15 shadow-lg border border-white/10" : "hover:bg-white/10 hover:translate-x-2"}`}
                            onClick={() => setSection("profile")}
                        >
                            {/* ACTIVE EFFECT */}
                            {section === "profile" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <User
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "profile" ? "scale-110 text-cyan-300" : ""}`}
                            />

                            <p
                                className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap relative z-10"
                            >
                                My Profile
                            </p>
                        </button>
                    </div>
                </div>

                {/* LOGOUT */}
                <div className="relative z-10">
                    <button
                        className=" flex items-center gap-4 w-full px-4 py-3 rounded-2xl bg-red-500/90 hover:bg-red-600 text-white cursor-pointer transition-all hover:translate-x-2 hover:shadow-2xl hover:shadow-red-500/20"
                        onClick={logOutHandler}
                    >
                        <LogOut className="translate-x-1 min-w-5" />

                        <p
                            className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap"
                        >
                            Logout
                        </p>
                    </button>
                </div>
            </div>

            <div className="w-full border border-red-500 overflow-y-auto h-screen">
                {section === "home" && <Home />}
                {/* {section === "profile" && <Profile />} */}
            </div>
        </div>
    )
}

export default DashboardTeamLeader