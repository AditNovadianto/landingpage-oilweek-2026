import { useEffect, useState } from "react"
import useImagePreload from "../../hooks/useImagePreload"
import logoOw from "../../images/Logo-ow.png"
import bg from "../../images/dashboard/bg-dashboard.png"
import { ClipboardList, House, LogOut, Trophy, User, UserRoundPlus, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Home from "../../components/dashboardUser/Home"
import Competitions from "../../components/dashboardUser/Competitions"
import Registrations from "../../components/dashboardUser/Registrations"
import MyProfile from "../../components/dashboardUser/MyProfile"
import TeamLeaders from "../../components/dashboardUser/TeamLeaders"
import CreateUser from "../../components/dashboardUser/CreateUser"

interface UserData {
    name_user?: string
    email_user?: string
}

const DashboardUser = () => {
    const bgLoaded = useImagePreload(bg)
    const navigate = useNavigate()

    const [user, setUser] = useState<UserData | null>(null)
    const [section, setSection] = useState("home")

    useEffect(() => {
        const userData = localStorage.getItem("user")

        if (userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (error) {
                setUser(null)
            }
        } else {
            setUser(null)
        }
    }, [])

    const logOutHandler = () => {
        sessionStorage.removeItem("token")
        localStorage.removeItem("user")

        navigate("/user/sign-in")
    }

    return (
        <div
            className="min-h-screen w-full flex bg-cover overflow-hidden"
            style={{
                backgroundImage: bgLoaded ? `url(${bg})` : "none",
                backgroundColor: "#0d1e2e",
                transition: "background-image 0.3s ease",
            }}
        >
            {/* SIDEBAR */}
            <div className="h-full group relative flex flex-col justify-between min-h-screen w-24 hover:w-72 shrink-0 transition-all duration-300 ease-in-out overflow-hidden bg-white/5 backdrop-blur-2xl border-r border-white/10 px-4 py-8 shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-center">
                        <img
                            src={logoOw}
                            alt="logo"
                            className="w-14 transition-all group-hover:scale-110 animate-pulse"
                        />
                    </div>

                    <div className="mt-10 px-3 py-3 flex items-center gap-4 text-white rounded-xl bg-linear-to-t from-[#091025] to-[#032155] overflow-hidden">
                        <User className="w-7 min-w-7 shrink-0 ml-1" />

                        <div className="min-w-0 flex-1 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                            <p
                                title={user?.name_user || "User"}
                                className="font-semibold font-inter italic truncate max-w-55"
                            >
                                {user?.name_user || "User"}
                            </p>

                            <p
                                title={user?.email_user || "user@email.com"}
                                className="font-light font-inter italic text-sm truncate max-w-55"
                            >
                                {user?.email_user || "user@email.com"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "home"
                                ? "bg-white/15 shadow-lg border border-white/10"
                                : "hover:bg-white/10"
                                }`}
                            onClick={() => setSection("home")}
                        >
                            {section === "home" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <House
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "home"
                                    ? "scale-110 text-cyan-300"
                                    : ""
                                    }`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate relative z-10">
                                Home
                            </p>
                        </button>

                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "profile"
                                ? "bg-white/15 shadow-lg border border-white/10"
                                : "hover:bg-white/10"
                                }`}
                            onClick={() => setSection("profile")}
                        >
                            {section === "profile" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <User
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "profile"
                                    ? "scale-110 text-cyan-300"
                                    : ""
                                    }`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate relative z-10">
                                My Profile
                            </p>
                        </button>

                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "competitions"
                                ? "bg-white/15 shadow-lg border border-white/10"
                                : "hover:bg-white/10"
                                }`}
                            onClick={() => setSection("competitions")}
                        >
                            {section === "competitions" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <Trophy
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "competitions"
                                    ? "scale-110 text-cyan-300"
                                    : ""
                                    }`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate relative z-10">
                                Competitions
                            </p>
                        </button>

                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "registrations"
                                ? "bg-white/15 shadow-lg border border-white/10"
                                : "hover:bg-white/10"
                                }`}
                            onClick={() => setSection("registrations")}
                        >
                            {section === "registrations" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <ClipboardList
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "registrations"
                                    ? "scale-110 text-cyan-300"
                                    : ""
                                    }`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate relative z-10">
                                Registrations
                            </p>
                        </button>

                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "teamLeaders"
                                ? "bg-white/15 shadow-lg border border-white/10"
                                : "hover:bg-white/10"
                                }`}
                            onClick={() => setSection("teamLeaders")}
                        >
                            {section === "teamLeaders" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <Users
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "teamLeaders"
                                    ? "scale-110 text-cyan-300"
                                    : ""
                                    }`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate relative z-10">
                                Team Leaders
                            </p>
                        </button>

                        <button
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl cursor-pointer text-white transition-all ease-in-out relative overflow-hidden ${section === "createUser"
                                ? "bg-white/15 shadow-lg border border-white/10"
                                : "hover:bg-white/10"
                                }`}
                            onClick={() => setSection("createUser")}
                        >
                            {section === "createUser" && (
                                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/10 rounded-2xl" />
                            )}

                            <UserRoundPlus
                                className={`translate-x-1 min-w-5 relative z-10 transition-all ${section === "createUser"
                                    ? "scale-110 text-cyan-300"
                                    : ""
                                    }`}
                            />

                            <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate relative z-10">
                                Create User
                            </p>
                        </button>
                    </div>
                </div>

                <div className="relative z-10">
                    <button
                        className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl bg-red-500/90 hover:bg-red-600 text-white cursor-pointer transition-all hover:shadow-2xl hover:shadow-red-500/20 overflow-hidden"
                        onClick={logOutHandler}
                    >
                        <LogOut className="translate-x-1 min-w-5 shrink-0" />

                        <p className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap truncate">
                            Logout
                        </p>
                    </button>
                </div>
            </div>

            <div className="w-full overflow-y-auto h-screen">
                {section === "home" && <Home />}
                {section === "profile" && <MyProfile />}
                {section === "competitions" && <Competitions />}
                {section === "registrations" && <Registrations />}
                {section === "teamLeaders" && <TeamLeaders />}
                {section === "createUser" && <CreateUser />}
            </div>
        </div>
    )
}

export default DashboardUser