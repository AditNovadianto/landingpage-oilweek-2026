import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../../utils/auth"
import { Mail, UserRound, ShieldCheck } from "lucide-react"

interface User {
    id_user?: number | string
    name_user?: string
    email_user?: string
    id_role?: number | string
    name_role?: string
}

const MyProfile = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
        }
    }, [navigate])

    useEffect(() => {
        const user = localStorage.getItem("user")
        const userObj = JSON.parse(user || "{}")

        if (user) {
            setUser(userObj)
        } else {
            setUser(null)
        }
    }, [])

    return (
        <div className="px-10 py-7">
            <div className="text-white">
                <p className="text-2xl font-bold italic">
                    My Profile
                </p>
            </div>

            <div className="glass mt-7 px-7 py-5 rounded-xl! text-white">
                <p className="font-semibold text-2xl font-garamond underline">
                    User Information
                </p>

                <div className="mt-5 flex flex-col gap-5">
                    <div className="glass p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                        <div className="flex items-center justify-between gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                                    <UserRound className="text-cyan-300" />
                                </div>

                                <div>
                                    <p className="text-2xl font-semibold text-white">
                                        {user?.name_user || "-"}
                                    </p>

                                    <p className="text-sm text-gray-300 mt-1">
                                        {user?.email_user || "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm">
                                {user?.name_role || `Role ID ${user?.id_role || "-"}`}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <UserRound size={16} />
                                    <p>User ID</p>
                                </div>

                                <p className="text-white mt-2">
                                    {user?.id_user || "-"}
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Mail size={16} />
                                    <p>Email</p>
                                </div>

                                <p className="text-white mt-2 break-all">
                                    {user?.email_user || "-"}
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <ShieldCheck size={16} />
                                    <p>Role</p>
                                </div>

                                <p className="text-white mt-2">
                                    {user?.name_role || `Role ID ${user?.id_role || "-"}`}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 bg-cyan-500/10 border border-cyan-400/20 p-5 rounded-2xl">
                            <p className="font-semibold text-lg text-white">
                                Account Summary
                            </p>

                            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                                This account is registered as a user in the
                                OilWeek system. You can access dashboard
                                features based on your assigned role and
                                permission.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile