import { useEffect, useMemo, useState } from "react"
import {
    Eye,
    Mail,
    Phone,
    Users,
    UserRound,
    GraduationCap,
    CreditCard,
    X,
    ShieldCheck,
} from "lucide-react"
import Toast from "../Toast"
import { isTokenExpired } from "../../utils/auth"
import { useNavigate } from "react-router-dom"

interface TeamLeader {
    id_team_leader: number
    name_team_leader: string
    major_team_leader: string
    email_team_leader: string
    phone_number_team_leader: string
    student_id_card: string
    twibbon?: string
    following_instagram?: string
    following_linkedin?: string
    following_tiktok?: string
    instagram_story?: string
    repost_competition_instagram?: string
}

interface Team {
    id_team: number
    team_name: string
    institution: string
    international_team: string
    id_team_leader: number
}

interface Member {
    id_member: number
    name_member: string
    phone_number_member: string
    email_member: string
    major_member: string
    student_id_card: string
    id_team?: number
    twibbon?: string
    following_instagram?: string
}

const TeamLeaders = () => {
    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])
    const [selectedLeader, setSelectedLeader] = useState<TeamLeader | null>(null)
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const navigate = useNavigate()

    const token = sessionStorage.getItem("token")

    useEffect(() => {
        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
        }
    }, [])

    const fetchTeamLeaders = async () => {
        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllTeamLeaders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            setTeamLeaders(data.teamLeaders || data.data || data)
        } catch (error) {
            console.error(error)
            setToast({
                message: "Failed to fetch team leaders.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTeamByLeader = async (id_team_leader: number) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getTeamById/${id_team_leader}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            const teamData = data.team || data.data || data
            setSelectedTeam(teamData)

            if (teamData?.id_team) {
                fetchMembersByTeam(teamData.id_team)
            } else {
                setMembers([])
            }
        } catch (error) {
            console.error(error)
            setSelectedTeam(null)
            setMembers([])
        }
    }

    const fetchMembersByTeam = async (id_team: number) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllMemberById/${id_team}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            setMembers(data.members || data.data || data)
        } catch (error) {
            console.error(error)
            setMembers([])
        }
    }

    useEffect(() => {
        fetchTeamLeaders()
    }, [])

    const filteredTeamLeaders = useMemo(() => {
        return teamLeaders.filter((leader) => {
            const keyword = search.toLowerCase()

            return (
                leader.name_team_leader?.toLowerCase().includes(keyword) ||
                leader.email_team_leader?.toLowerCase().includes(keyword) ||
                leader.major_team_leader?.toLowerCase().includes(keyword)
            )
        })
    }, [teamLeaders, search])

    const openDetailModal = async (leader: TeamLeader) => {
        setSelectedLeader(leader)
        setSelectedTeam(null)
        setMembers([])
        setIsDetailModalOpen(true)

        await fetchTeamByLeader(leader.id_team_leader)
    }

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Team Leader Management
                </p>
                <p className="text-sm opacity-70 mt-1">
                    View team leader profiles, assigned teams, and team members.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <UserRound className="mb-3" />
                    <p className="text-sm opacity-70">Total Team Leader</p>
                    <p className="text-3xl font-bold mt-1">
                        {teamLeaders.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <ShieldCheck className="mb-3" />
                    <p className="text-sm opacity-70">Registered Account</p>
                    <p className="text-3xl font-bold mt-1">
                        {teamLeaders.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">Selected Team Members</p>
                    <p className="text-3xl font-bold mt-1">
                        {members.length}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Team Leader List
                        </p>
                        <p className="text-sm opacity-70">
                            List of all registered team leaders.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search team leader..."
                        className="w-full md:w-72 px-4 py-2 rounded-lg bg-white text-black"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3">No</th>
                                <th className="text-left py-3">Name</th>
                                <th className="text-left py-3">Email</th>
                                <th className="text-left py-3">Major</th>
                                <th className="text-left py-3">Phone</th>
                                <th className="text-left py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTeamLeaders.map((leader, index) => (
                                <tr
                                    key={leader.id_team_leader}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3">{index + 1}</td>
                                    <td className="py-3 font-medium">
                                        {leader.name_team_leader}
                                    </td>
                                    <td className="py-3">
                                        {leader.email_team_leader}
                                    </td>
                                    <td className="py-3">
                                        {leader.major_team_leader}
                                    </td>
                                    <td className="py-3">
                                        {leader.phone_number_team_leader}
                                    </td>
                                    <td className="py-3">
                                        <button
                                            onClick={() =>
                                                openDetailModal(leader)
                                            }
                                            className="cursor-pointer glass p-2 rounded-lg"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading team leaders...
                        </p>
                    )}

                    {!isLoading && filteredTeamLeaders.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-6">
                            No team leader data found.
                        </p>
                    )}
                </div>
            </div>

            {isDetailModalOpen && selectedLeader && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                Team Leader Detail
                            </p>

                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="glass p-5 rounded-2xl">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                                        <UserRound className="text-cyan-300" />
                                    </div>

                                    <div>
                                        <p className="text-2xl font-semibold">
                                            {selectedLeader.name_team_leader}
                                        </p>
                                        <p className="text-sm opacity-70">
                                            {selectedLeader.email_team_leader}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm w-max">
                                    {selectedLeader.major_team_leader}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <InfoCard
                                    icon={<Mail size={18} />}
                                    label="Email"
                                    value={selectedLeader.email_team_leader}
                                />
                                <InfoCard
                                    icon={<Phone size={18} />}
                                    label="Phone Number"
                                    value={
                                        selectedLeader.phone_number_team_leader
                                    }
                                />
                                <InfoCard
                                    icon={<CreditCard size={18} />}
                                    label="Student ID Card"
                                    value={selectedLeader.student_id_card}
                                />
                                <InfoCard
                                    icon={<GraduationCap size={18} />}
                                    label="Major"
                                    value={selectedLeader.major_team_leader}
                                />
                            </div>

                            <div className="mt-6">
                                <p className="font-semibold text-lg mb-4">
                                    Uploaded Files
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: "Twibbon",
                                            value: selectedLeader.twibbon,
                                        },
                                        {
                                            label: "Following Instagram",
                                            value: selectedLeader.following_instagram,
                                        },
                                        {
                                            label: "Following LinkedIn",
                                            value: selectedLeader.following_linkedin,
                                        },
                                        {
                                            label: "Following TikTok",
                                            value: selectedLeader.following_tiktok,
                                        },
                                        {
                                            label: "Instagram Story",
                                            value: selectedLeader.instagram_story,
                                        },
                                        {
                                            label: "Repost Competition Instagram",
                                            value: selectedLeader.repost_competition_instagram,
                                        },
                                    ].map((file, index) =>
                                        file.value ? (
                                            <a
                                                key={index}
                                                href={file.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 p-4 rounded-xl transition-all duration-300 flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {file.label}
                                                    </p>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        Open file
                                                    </p>
                                                </div>

                                                <span>↗</span>
                                            </a>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="glass p-5 rounded-2xl mt-5">
                            <p className="font-semibold text-lg mb-4">
                                Team Information
                            </p>

                            {selectedTeam ? (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <InfoCard
                                        icon={<Users size={18} />}
                                        label="Team Name"
                                        value={selectedTeam.team_name}
                                    />
                                    <InfoCard
                                        icon={<GraduationCap size={18} />}
                                        label="Institution"
                                        value={selectedTeam.institution}
                                    />
                                    <InfoCard
                                        icon={<ShieldCheck size={18} />}
                                        label="International Team"
                                        value={selectedTeam.international_team}
                                    />
                                    <InfoCard
                                        icon={<Users size={18} />}
                                        label="Total Member"
                                        value={members.length}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm opacity-70">
                                    This team leader has not created a team yet.
                                </p>
                            )}
                        </div>

                        <div className="glass p-5 rounded-2xl mt-5">
                            <p className="font-semibold text-lg mb-4">
                                Team Members
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-3">
                                                No
                                            </th>
                                            <th className="text-left py-3">
                                                Name
                                            </th>
                                            <th className="text-left py-3">
                                                Email
                                            </th>
                                            <th className="text-left py-3">
                                                Phone
                                            </th>
                                            <th className="text-left py-3">
                                                Major
                                            </th>
                                            <th className="text-left py-3">
                                                Student ID
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {members.map((member, index) => (
                                            <tr
                                                key={member.id_member}
                                                className="border-b border-white/10"
                                            >
                                                <td className="py-3">
                                                    {index + 1}
                                                </td>
                                                <td className="py-3">
                                                    {member.name_member}
                                                </td>
                                                <td className="py-3">
                                                    {member.email_member}
                                                </td>
                                                <td className="py-3">
                                                    {
                                                        member.phone_number_member
                                                    }
                                                </td>
                                                <td className="py-3">
                                                    {member.major_member}
                                                </td>
                                                <td className="py-3">
                                                    {member.student_id_card}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {members.length === 0 && (
                                    <p className="text-center text-sm opacity-70 py-6">
                                        No member data found for this team.
                                    </p>
                                )}
                            </div>
                        </div>
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

const InfoCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value?: string | number
}) => {
    return (
        <div className="bg-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                {icon}
                <p>{label}</p>
            </div>

            <p className="text-white mt-2 break-all">{value || "-"}</p>
        </div>
    )
}

export default TeamLeaders