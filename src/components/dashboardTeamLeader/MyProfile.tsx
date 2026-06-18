import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../../utils/auth"

interface User {
    id_team_leader?: string
    name_team_leader?: string
    email_team_leader?: string
    major_team_leader?: string
    phone_number_team_leader?: string
    student_id_card?: string
    twibbon?: string
    following_instagram?: string
    following_linkedin?: string
    following_tiktok?: string
    instagram_story?: string
    repost_competition_instagram?: string
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

            navigate("/team-leader/sign-in")
        }
    }, [])

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
            <p className="font-semibold text-white text-4xl underline font-garamond">
                My Profile
            </p>

            <div className="glass mt-7 px-7 py-5 rounded-xl! text-white">
                <p className="font-semibold text-2xl font-garamond underline">
                    Team Leader Information
                </p>

                <div className="mt-5 flex flex-col gap-5">
                    <div
                        className="glass p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-semibold text-white">
                                    {user?.name_team_leader}
                                </p>

                                <p className="text-sm text-gray-300 mt-1">
                                    {user?.email_team_leader}
                                </p>
                            </div>

                            <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm">
                                {user?.major_team_leader}
                            </div>
                        </div>

                        {/* INFORMATION */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm">
                                    Phone Number
                                </p>

                                <p className="text-white mt-1">
                                    {user?.phone_number_team_leader}
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm">
                                    Student ID Card
                                </p>

                                <p className="text-white mt-1">
                                    {user?.student_id_card}
                                </p>
                            </div>
                        </div>

                        {/* FILES */}
                        <div className="mt-6">
                            <p className="font-semibold text-lg text-white mb-4">
                                Uploaded Files
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        label: "Twibbon",
                                        value: user?.twibbon,
                                    },
                                    {
                                        label: "Following Instagram",
                                        value: user?.following_instagram,
                                    },
                                    {
                                        label: "Following LinkedIn",
                                        value: user?.following_linkedin,
                                    },
                                    {
                                        label: "Following TikTok",
                                        value: user?.following_tiktok,
                                    },
                                    {
                                        label: "Instagram Story",
                                        value: user?.instagram_story,
                                    },
                                    {
                                        label: "Repost Competition Instagram",
                                        value: user?.repost_competition_instagram,
                                    },
                                ].map((file, index) => (
                                    <a
                                        key={index}
                                        href={file.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className=" bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 p-4 rounded-xl transition-all duration-300 flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="text-white font-medium">
                                                {file.label}
                                            </p>

                                            <p className="text-gray-400 text-sm mt-1">
                                                Click to download
                                            </p>
                                        </div>

                                        <div
                                            className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                                        >
                                            ⬇
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile