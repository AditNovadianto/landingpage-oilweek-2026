import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { isTokenExpired } from "../../utils/auth"
import Toast from "../Toast"

interface User {
    id_team_leader?: string
    name_team_leader?: string
    email_team_leader?: string
}

interface Team {
    id_team?: string
    team_name?: string
    institution?: string
}

const Home = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)
    const [team, setTeam] = useState<Team | null>(null)
    const [member, setMember] = useState<any[] | null>(null)

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const [showModalCreateTeam, setShowModalCreateTeam] = useState(false)

    const [showModalCreateMember, setShowModalCreateMember] = useState(false)

    const [teamFormData, setTeamFormData] = useState({
        team_name: "",
        institution: "",
        international_team: "NO"
    })

    const [memberFormData, setMemberFormData] = useState({
        name_member: "",
        phone_number_member: "",
        email_member: "",
        major_member: "",
        student_id_card: "",
    })

    const [memberFiles, setMemberFiles] = useState({
        twibbon: null as File | null,
        following_instagram: null as File | null,
        following_linkedin: null as File | null,
        following_tiktok: null as File | null,
        instagram_story: null as File | null,
        repost_competition_instagram: null as File | null,
    })

    const [loadingCreateTeam, setLoadingCreateTeam] = useState(false)
    const [loadingCreateMember, setLoadingCreateMember] = useState(false)

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

    useEffect(() => {
        if (!user?.id_team_leader) return

        const token = sessionStorage.getItem("token")

        const getTeamData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getTeamById/${user.id_team_leader}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.status === 202) {
                    setTeam(null)
                } else {
                    const teamData = await response.json()

                    setTeam(teamData.team)
                }
            } catch (error) {
                console.error(error)
            }
        }

        getTeamData()
    }, [user, showModalCreateTeam])

    useEffect(() => {
        if (!team?.id_team) return

        const token = sessionStorage.getItem("token")

        const getMemberData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllMemberById/${team.id_team}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.status === 202) {
                    setMember(null)
                } else {
                    const memberData = await response.json()

                    setMember(memberData.members)
                }
            } catch (error) {
                console.error(error)
            }
        }

        getMemberData()
    }, [team, showModalCreateMember])

    const handleTeamFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setTeamFormData({
            ...teamFormData,
            [e.target.name]: e.target.value,
        })
    }

    const handleMemberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setMemberFormData({
            ...memberFormData,
            [e.target.name]: e.target.value,
        })
    }

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, files } = e.target

        if (files && files[0]) {
            setMemberFiles((prev) => ({
                ...prev,
                [name]: files[0],
            }))
        }
    }

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoadingCreateTeam(true)

        try {
            const token = sessionStorage.getItem("token")

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/createTeam`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...teamFormData,
                        id_team_leader: user?.id_team_leader,
                    }),
                }
            )

            const data = await response.json()

            console.log(data)

            if (response.ok) {
                setToast({ message: "Team created successfully!", type: "success" })

                setTimeout(() => setShowModalCreateTeam(false), 2000)
            }
        } catch (error) {
            console.error(error)

            setToast({ message: "Gagal membuat tim. Silakan coba lagi.", type: "error" })

            setTimeout(() => setToast(null), 2000)
        } finally {
            setLoadingCreateTeam(false)
        }
    }

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoadingCreateMember(true)

        try {
            const token = sessionStorage.getItem("token")

            const formData = new FormData()

            formData.append("name_member", memberFormData.name_member)
            formData.append("phone_number_member", memberFormData.phone_number_member)
            formData.append("email_member", memberFormData.email_member)
            formData.append("major_member", memberFormData.major_member)
            formData.append("student_id_card", memberFormData.student_id_card)
            formData.append("id_team", String(team?.id_team))

            Object.entries(memberFiles).forEach(([key, value]) => {
                if (value) {
                    formData.append(key, value)
                }
            })

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/createMember`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            )

            const data = await response.json()

            console.log(data)

            if (response.ok) {
                setToast({ message: "Member added successfully!", type: "success" })

                setTimeout(() => setShowModalCreateMember(false), 2000)
            }
        } catch (error) {
            console.error(error)
            setToast({ message: "Gagal menambahkan member. Silakan coba lagi.", type: "error" })
            setTimeout(() => setToast(null), 2000)
        } finally {
            setLoadingCreateMember(false)
        }
    }

    console.log("team: ", team)
    console.log("member: ", member)

    return (
        <div className="px-10 py-7">
            <p className="font-semibold text-white text-4xl underline font-garamond">
                Home
            </p>

            <div className="mt-10">
                {team ? (
                    <div className="glass px-7 py-5 rounded-xl! text-white">
                        <p className="font-semibold text-2xl font-garamond underline">
                            Team Information
                        </p>

                        <div className="mt-5">
                            <p>Team Name:</p>

                            <p className="font-semibold">{team.team_name}</p>
                        </div>

                        <div className="mt-3">
                            <p>Universitas:</p>

                            <p className="font-semibold">{team.institution}</p>
                        </div>

                        <div className="mt-3">
                            <p>Total Members:</p>

                            <p className="font-semibold">{member?.length || 0}</p>
                        </div>
                    </div>
                ) : (
                    <div className="glass px-7 py-5 rounded-xl! text-white">
                        <p className="font-semibold text-2xl font-garamond underline">
                            Team Information
                        </p>

                        <p className="text-white mt-5">
                            You don't have a team yet.
                        </p>

                        <button
                            onClick={() => setShowModalCreateTeam(true)}
                            className="cursor-pointer mt-5 w-full px-5 py-3 rounded-xl bg-linear-to-t from-[#091025] to-[#032155]"
                        >
                            Create Team
                        </button>
                    </div>
                )}

                {member && member.length > 0 ? (
                    <div className="glass mt-7 px-7 py-5 rounded-xl! text-white">
                        <p className="font-semibold text-2xl font-garamond underline">
                            Team Members
                        </p>

                        <div className="mt-5 flex flex-col gap-5">
                            {member.map((m) => (
                                <div
                                    key={m.id_member}
                                    className="glass p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                                >
                                    {/* HEADER */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-semibold text-white">
                                                {m.name_member}
                                            </p>

                                            <p className="text-sm text-gray-300 mt-1">
                                                {m.email_member}
                                            </p>
                                        </div>

                                        <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm">
                                            {m.major_member}
                                        </div>
                                    </div>

                                    {/* INFORMATION */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <p className="text-gray-400 text-sm">
                                                Phone Number
                                            </p>

                                            <p className="text-white mt-1">
                                                {m.phone_number_member}
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-xl">
                                            <p className="text-gray-400 text-sm">
                                                Student ID Card
                                            </p>

                                            <p className="text-white mt-1">
                                                {m.student_id_card}
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
                                                    value: m.twibbon,
                                                },
                                                {
                                                    label: "Following Instagram",
                                                    value: m.following_instagram,
                                                },
                                                {
                                                    label: "Following LinkedIn",
                                                    value: m.following_linkedin,
                                                },
                                                {
                                                    label: "Following TikTok",
                                                    value: m.following_tiktok,
                                                },
                                                {
                                                    label: "Instagram Story",
                                                    value: m.instagram_story,
                                                },
                                                {
                                                    label: "Repost Competition Instagram",
                                                    value: m.repost_competition_instagram,
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
                            ))}
                        </div>

                        {member.length < 3 && (
                            <button
                                onClick={() => setShowModalCreateMember(true)}
                                className="cursor-pointer mt-5 w-full px-5 py-3 rounded-xl bg-linear-to-t from-[#091025] to-[#032155]"
                            >
                                Add Member
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="glass mt-7 px-7 py-5 rounded-xl! text-white">
                        <p className="font-semibold text-2xl font-garamond underline">
                            Team Members
                        </p>

                        <p className="text-white mt-5">No members in your team yet.</p>

                        <button
                            onClick={() => setShowModalCreateMember(true)}
                            className="cursor-pointer mt-5 w-full px-5 py-3 rounded-xl bg-linear-to-t from-[#091025] to-[#032155]"
                        >
                            Add Member
                        </button>
                    </div>
                )}
            </div>

            {showModalCreateTeam && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="glass w-full max-w-lg rounded-2xl p-7 text-white relative">
                        <button
                            onClick={() => setShowModalCreateTeam(false)}
                            className="cursor-pointer absolute top-5 right-5"
                        >
                            <X />
                        </button>

                        <p className="text-3xl font-semibold font-garamond underline">
                            Create Team
                        </p>

                        <form
                            onSubmit={handleCreateTeam}
                            className="mt-7 space-y-5"
                        >
                            <div>
                                <p className="mb-2">Team Name</p>

                                <input
                                    type="text"
                                    name="team_name"
                                    value={teamFormData.team_name}
                                    onChange={handleTeamFormChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none"
                                    placeholder="Input your team name"
                                    required
                                />
                            </div>

                            <div>
                                <p className="mb-2">Institution</p>

                                <input
                                    type="text"
                                    name="institution"
                                    value={teamFormData.institution}
                                    onChange={handleTeamFormChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none"
                                    placeholder="Input your institution"
                                    required
                                />
                            </div>

                            <div>
                                <p className="mb-2">International Team</p>

                                <select
                                    name="international_team"
                                    value={teamFormData.international_team}
                                    onChange={handleTeamFormChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none"
                                >
                                    <option value="NO" className="text-black">NO</option>
                                    <option value="YES" className="text-black">YES</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="cursor-pointer w-full py-3 rounded-xl bg-linear-to-t from-[#091025] to-[#032155] font-semibold"
                            >
                                {loadingCreateTeam ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                        Creating Team...
                                    </div>
                                ) : (
                                    "Create Team"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showModalCreateMember && (
                <div className="fixed inset-0 bg-black/60 flex justify-center z-50 overflow-y-auto p-5">
                    <div className="glass w-full h-max max-w-2xl rounded-2xl p-7 text-white relative">
                        <button
                            onClick={() => setShowModalCreateMember(false)}
                            className="cursor-pointer absolute top-5 right-5"
                        >
                            <X />
                        </button>

                        <p className="text-3xl font-semibold font-garamond underline">
                            Add Member
                        </p>

                        <form
                            onSubmit={handleCreateMember}
                            className="mt-7 space-y-5"
                        >
                            <input
                                type="text"
                                name="name_member"
                                placeholder="Member Name"
                                onChange={handleMemberChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10"
                                required
                            />

                            <input
                                type="text"
                                name="phone_number_member"
                                placeholder="Phone Number"
                                onChange={handleMemberChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10"
                                required
                            />

                            <input
                                type="email"
                                name="email_member"
                                placeholder="Email"
                                onChange={handleMemberChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10"
                                required
                            />

                            <input
                                type="text"
                                name="major_member"
                                placeholder="Major"
                                onChange={handleMemberChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10"
                                required
                            />

                            <input
                                type="text"
                                name="student_id_card"
                                placeholder="Student ID Card"
                                onChange={handleMemberChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/10"
                                required
                            />

                            <div className="space-y-3">
                                <p className="font-semibold">Upload Files</p>

                                {[
                                    "twibbon",
                                    "following_instagram",
                                    "following_linkedin",
                                    "following_tiktok",
                                    "instagram_story",
                                    "repost_competition_instagram",
                                ].map((fileName) => (
                                    <div key={fileName}>
                                        <p className="mb-2 capitalize">
                                            {fileName.replace(/_/g, " ")}
                                        </p>

                                        <input
                                            type="file"
                                            name={fileName}
                                            onChange={handleFileChange}
                                            className="w-full border border-white/20 rounded-xl bg-white/10 px-4 py-3 cursor-pointer"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="cursor-pointer w-full py-3 rounded-xl bg-linear-to-t from-[#091025] to-[#032155] font-semibold"
                            >
                                {loadingCreateMember ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                        Creating Member...
                                    </div>
                                ) : (
                                    "Create Member"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}

export default Home