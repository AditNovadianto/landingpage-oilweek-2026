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
    FileText,
} from "lucide-react"
import Toast from "../Toast"
import { isTokenExpired } from "../../utils/auth"
import { useNavigate } from "react-router-dom"

interface Competition {
    id_competition: number
    name_competition: string
    status_competition: string
}

interface Registration {
    id_registration: number
    id_competition: number
    id_team?: number
    id_team_leader: number
}

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
    team_name?: string
    name_team?: string
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
    following_linkedin?: string
    following_tiktok?: string
    instagram_story?: string
    repost_competition_instagram?: string
}

const TeamLeaders = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [allMembers, setAllMembers] = useState<Member[]>([])

    const [selectedLeader, setSelectedLeader] = useState<TeamLeader | null>(null)
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [selectedMember, setSelectedMember] = useState<Member | null>(null)

    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isMemberFileModalOpen, setIsMemberFileModalOpen] = useState(false)

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const CASE_STUDY_KEYWORD = "case study"

    useEffect(() => {
        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
        }
    }, [navigate, token])

    const normalizeArray = <T,>(data: any, key: string): T[] => {
        if (Array.isArray(data)) return data
        if (Array.isArray(data?.[key])) return data[key]
        if (Array.isArray(data?.data)) return data.data
        return []
    }

    const fetchData = async () => {
        try {
            setIsLoading(true)

            const headers = {
                Authorization: `Bearer ${token}`,
            }

            const [
                competitionsRes,
                registrationsRes,
                teamLeadersRes,
                teamsRes,
                membersRes,
            ] = await Promise.all([
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
                    { headers }
                ),
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllRegistrations`,
                    { headers }
                ),
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllTeamLeaders`,
                    { headers }
                ),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTeams`, {
                    headers,
                }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllMembers`, {
                    headers,
                }),
            ])

            const competitionsData = await competitionsRes.json()
            const registrationsData = await registrationsRes.json()
            const teamLeadersData = await teamLeadersRes.json()
            const teamsData = await teamsRes.json()
            const membersData = await membersRes.json()

            setCompetitions(
                normalizeArray<Competition>(competitionsData, "competitions")
            )
            setRegistrations(
                normalizeArray<Registration>(
                    registrationsData,
                    "registrations"
                )
            )
            setTeamLeaders(
                normalizeArray<TeamLeader>(teamLeadersData, "teamLeaders")
            )
            setTeams(normalizeArray<Team>(teamsData, "teams"))
            setAllMembers(normalizeArray<Member>(membersData, "members"))
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

    useEffect(() => {
        fetchData()
    }, [])

    const caseStudyCompetition = useMemo(() => {
        return competitions.find((competition) =>
            competition.name_competition
                ?.toLowerCase()
                .includes(CASE_STUDY_KEYWORD)
        )
    }, [competitions])

    const caseStudyRegistrations = useMemo(() => {
        if (!caseStudyCompetition) return []

        return registrations.filter(
            (registration) =>
                Number(registration.id_competition) ===
                Number(caseStudyCompetition.id_competition)
        )
    }, [registrations, caseStudyCompetition])

    const caseStudyTeamLeaders = useMemo(() => {
        const leaderIds = caseStudyRegistrations
            .map((registration) => Number(registration.id_team_leader))
            .filter(Boolean)

        return teamLeaders.filter((leader) =>
            leaderIds.includes(Number(leader.id_team_leader))
        )
    }, [teamLeaders, caseStudyRegistrations])

    const caseStudyTeams = useMemo(() => {
        const leaderIds = caseStudyRegistrations
            .map((registration) => Number(registration.id_team_leader))
            .filter(Boolean)

        return teams.filter((team) =>
            leaderIds.includes(Number(team.id_team_leader))
        )
    }, [teams, caseStudyRegistrations])

    const filteredTeamLeaders = useMemo(() => {
        const keyword = search.toLowerCase()

        return caseStudyTeamLeaders.filter((leader) => {
            return (
                leader.name_team_leader?.toLowerCase().includes(keyword) ||
                leader.email_team_leader?.toLowerCase().includes(keyword) ||
                leader.major_team_leader?.toLowerCase().includes(keyword)
            )
        })
    }, [caseStudyTeamLeaders, search])

    const selectedMembers = useMemo(() => {
        if (!selectedTeam) return []

        return allMembers.filter(
            (member) => Number(member.id_team) === Number(selectedTeam.id_team)
        )
    }, [allMembers, selectedTeam])

    const caseStudyMembers = useMemo(() => {
        const teamIds = caseStudyTeams.map((team) => team.id_team)

        return allMembers.filter((member) =>
            teamIds.includes(Number(member.id_team))
        )
    }, [allMembers, caseStudyTeams])

    const openDetailModal = (leader: TeamLeader) => {
        const team =
            caseStudyTeams.find(
                (item) =>
                    Number(item.id_team_leader) ===
                    Number(leader.id_team_leader)
            ) || null

        setSelectedLeader(leader)
        setSelectedTeam(team)
        setIsDetailModalOpen(true)
    }

    const openMemberFilesModal = (member: Member) => {
        setSelectedMember(member)
        setIsMemberFileModalOpen(true)
    }

    const closeMemberFilesModal = () => {
        setSelectedMember(null)
        setIsMemberFileModalOpen(false)
    }

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Case Study Team Leader Management
                </p>
                <p className="text-sm opacity-70 mt-1">
                    View team leaders, teams, and members registered in Case
                    Study Competition only.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <UserRound className="mb-3" />
                    <p className="text-sm opacity-70">Total Team Leader</p>
                    <p className="text-3xl font-bold mt-1">
                        {caseStudyTeamLeaders.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <ShieldCheck className="mb-3" />
                    <p className="text-sm opacity-70">Registered Team</p>
                    <p className="text-3xl font-bold mt-1">
                        {caseStudyTeams.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">Total Members</p>
                    <p className="text-3xl font-bold mt-1">
                        {caseStudyMembers.length}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Case Study Team Leader List
                        </p>
                        <p className="text-sm opacity-70">
                            List of team leaders registered in Case Study
                            Competition.
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
                                <th className="text-left py-3 px-3">No</th>
                                <th className="text-left py-3 px-3">Name</th>
                                <th className="text-left py-3 px-3">Email</th>
                                <th className="text-left py-3 px-3">Major</th>
                                <th className="text-left py-3 px-3">Phone</th>
                                <th className="text-left py-3 px-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTeamLeaders.map((leader, index) => (
                                <tr
                                    key={leader.id_team_leader}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3 px-3">{index + 1}</td>

                                    <td className="py-3 px-3 font-medium min-w-45">
                                        {leader.name_team_leader}
                                    </td>

                                    <td className="py-3 px-3 min-w-55">
                                        {leader.email_team_leader}
                                    </td>

                                    <td className="py-3 px-3 min-w-40">
                                        {leader.major_team_leader}
                                    </td>

                                    <td className="py-3 px-3 min-w-37.5">
                                        {leader.phone_number_team_leader}
                                    </td>

                                    <td className="py-3 px-3">
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
                            No Case Study team leader data found.
                        </p>
                    )}
                </div>
            </div>

            {isDetailModalOpen && selectedLeader && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
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
                                    Team Leader Uploaded Files
                                </p>

                                <FileGrid
                                    files={[
                                        {
                                            label: "Student ID Card",
                                            value:
                                                selectedLeader.student_id_card,
                                        },
                                        {
                                            label: "Twibbon",
                                            value: selectedLeader.twibbon,
                                        },
                                        {
                                            label: "Following Instagram",
                                            value:
                                                selectedLeader.following_instagram,
                                        },
                                        {
                                            label: "Following LinkedIn",
                                            value:
                                                selectedLeader.following_linkedin,
                                        },
                                        {
                                            label: "Following TikTok",
                                            value:
                                                selectedLeader.following_tiktok,
                                        },
                                        {
                                            label: "Instagram Story",
                                            value:
                                                selectedLeader.instagram_story,
                                        },
                                        {
                                            label: "Repost Competition Instagram",
                                            value:
                                                selectedLeader.repost_competition_instagram,
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="glass p-5 rounded-2xl mt-5">
                            <p className="font-semibold text-lg mb-4">
                                Case Study Team Information
                            </p>

                            {selectedTeam ? (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <InfoCard
                                        icon={<Users size={18} />}
                                        label="Team Name"
                                        value={
                                            selectedTeam.team_name ||
                                            selectedTeam.name_team
                                        }
                                    />

                                    <InfoCard
                                        icon={<GraduationCap size={18} />}
                                        label="Institution"
                                        value={selectedTeam.institution}
                                    />

                                    <InfoCard
                                        icon={<ShieldCheck size={18} />}
                                        label="International Team"
                                        value={
                                            selectedTeam.international_team
                                        }
                                    />

                                    <InfoCard
                                        icon={<Users size={18} />}
                                        label="Total Member"
                                        value={selectedMembers.length}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm opacity-70">
                                    This team leader has no registered team in
                                    Case Study Competition.
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
                                            <th className="text-left py-3 px-3">
                                                No
                                            </th>
                                            <th className="text-left py-3 px-3">
                                                Name
                                            </th>
                                            <th className="text-left py-3 px-3">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-3">
                                                Phone
                                            </th>
                                            <th className="text-left py-3 px-3">
                                                Major
                                            </th>
                                            <th className="text-left py-3 px-3">
                                                Student ID
                                            </th>
                                            <th className="text-left py-3 px-3">
                                                Files
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedMembers.map(
                                            (member, index) => (
                                                <tr
                                                    key={member.id_member}
                                                    className="border-b border-white/10"
                                                >
                                                    <td className="py-3 px-3">
                                                        {index + 1}
                                                    </td>

                                                    <td className="py-3 px-3 min-w-40 font-medium">
                                                        {member.name_member}
                                                    </td>

                                                    <td className="py-3 px-3 min-w-57.5">
                                                        {member.email_member}
                                                    </td>

                                                    <td className="py-3 px-3 min-w-37.5">
                                                        {
                                                            member.phone_number_member
                                                        }
                                                    </td>

                                                    <td className="py-3 px-3 min-w-37.5">
                                                        {member.major_member}
                                                    </td>

                                                    <td className="py-3 px-3 min-w-40">
                                                        {
                                                            member.student_id_card
                                                        }
                                                    </td>

                                                    <td className="py-3 px-3 min-w-32.5">
                                                        <button
                                                            onClick={() =>
                                                                openMemberFilesModal(
                                                                    member
                                                                )
                                                            }
                                                            className="glass px-4 py-2 rounded-xl border border-cyan-400/20 text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer flex items-center gap-2"
                                                        >
                                                            <FileText
                                                                size={15}
                                                            />
                                                            View Files
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {selectedMembers.length === 0 && (
                                    <p className="text-center text-sm opacity-70 py-6">
                                        No member data found for this team.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isMemberFileModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-2xl font-semibold">
                                    Member Uploaded Files
                                </p>

                                <p className="text-sm text-gray-400 mt-1">
                                    {selectedMember.name_member}
                                </p>
                            </div>

                            <button
                                onClick={closeMemberFilesModal}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <FileGrid
                            files={[
                                {
                                    label: "Student ID Card",
                                    value: selectedMember.student_id_card,
                                },
                                {
                                    label: "Twibbon",
                                    value: selectedMember.twibbon,
                                },
                                {
                                    label: "Following Instagram",
                                    value:
                                        selectedMember.following_instagram,
                                },
                                {
                                    label: "Following LinkedIn",
                                    value:
                                        selectedMember.following_linkedin,
                                },
                                {
                                    label: "Following TikTok",
                                    value:
                                        selectedMember.following_tiktok,
                                },
                                {
                                    label: "Instagram Story",
                                    value:
                                        selectedMember.instagram_story,
                                },
                                {
                                    label: "Repost Competition Instagram",
                                    value:
                                        selectedMember.repost_competition_instagram,
                                },
                            ]}
                        />
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

const FileGrid = ({
    files,
}: {
    files: {
        label: string
        value?: string
    }[]
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, index) => (
                <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                    <p className="font-medium text-white">{file.label}</p>

                    {file.value ? (
                        <a
                            href={file.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/20 transition-all"
                        >
                            Open File ↗
                        </a>
                    ) : (
                        <p className="text-gray-500 mt-3 text-sm">
                            File not uploaded
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default TeamLeaders