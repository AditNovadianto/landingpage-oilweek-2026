import { useEffect, useMemo, useState } from "react"
import {
    Trophy,
    Users,
    UserRound,
    ClipboardList,
    Layers,
    UserCheck,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../../utils/auth"

interface Competition {
    id_competition: number
    name_competition?: string
}

interface TeamLeader {
    id_team_leader: number
    name_team_leader?: string
}

interface Team {
    id_team: number
    name_team?: string
    id_team_leader?: number
}

interface Member {
    id_member: number
    name_member?: string
    id_team?: number
}

interface Registration {
    id_registration: number
    id_team?: number
    id_competition?: number
    id_team_leader?: number
    status_registration?: string
    payment_status?: string
}

const Home = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const PAPER_AND_POSTER_KEYWORD = "paper&poster"

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
                teamLeadersRes,
                teamsRes,
                membersRes,
                registrationsRes,
            ] = await Promise.all([
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
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
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllRegistrations`,
                    { headers }
                ),
            ])

            const competitionsData = await competitionsRes.json()
            const teamLeadersData = await teamLeadersRes.json()
            const teamsData = await teamsRes.json()
            const membersData = await membersRes.json()
            const registrationsData = await registrationsRes.json()

            setCompetitions(
                normalizeArray<Competition>(competitionsData, "competitions")
            )
            setTeamLeaders(
                normalizeArray<TeamLeader>(teamLeadersData, "teamLeaders")
            )
            setTeams(normalizeArray<Team>(teamsData, "teams"))
            setMembers(normalizeArray<Member>(membersData, "members"))
            setRegistrations(
                normalizeArray<Registration>(
                    registrationsData,
                    "registrations"
                )
            )
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const paperAndPosterCompetition = useMemo(() => {
        return competitions.find((competition) =>
            competition.name_competition
                ?.toLowerCase()
                .replace(/\s+/g, "")
                .includes(PAPER_AND_POSTER_KEYWORD)
        )
    }, [competitions])

    const paperAndPosterRegistrations = useMemo(() => {
        if (!paperAndPosterCompetition) return []

        return registrations.filter(
            (registration) =>
                Number(registration.id_competition) ===
                Number(paperAndPosterCompetition.id_competition)
        )
    }, [registrations, paperAndPosterCompetition])

    const paperAndPosterTeams = useMemo(() => {
        const leaderIds = paperAndPosterRegistrations
            .map((registration) => Number(registration.id_team_leader))
            .filter(Boolean)

        return teams.filter((team) =>
            leaderIds.includes(Number(team.id_team_leader))
        )
    }, [teams, paperAndPosterRegistrations])

    const paperAndPosterTeamLeaders = useMemo(() => {
        const leaderIds = paperAndPosterRegistrations
            .map((registration) => Number(registration.id_team_leader))
            .filter(Boolean)

        return teamLeaders.filter((teamLeader) =>
            leaderIds.includes(Number(teamLeader.id_team_leader))
        )
    }, [teamLeaders, paperAndPosterRegistrations])

    const paperAndPosterMembers = useMemo(() => {
        const teamIds = paperAndPosterTeams.map((team) => team.id_team)

        return members.filter((member) => teamIds.includes(Number(member.id_team)))
    }, [members, paperAndPosterTeams])

    const memberByTeam = useMemo(() => {
        return paperAndPosterTeams.map((team) => {
            const totalMember = paperAndPosterMembers.filter(
                (member) => member.id_team === team.id_team
            ).length

            return {
                ...team,
                totalMember,
            }
        })
    }, [paperAndPosterTeams, paperAndPosterMembers])

    const maxMember = Math.max(
        ...memberByTeam.map((team) => team.totalMember),
        1
    )

    const avgMemberPerTeam =
        paperAndPosterTeams.length > 0
            ? (paperAndPosterMembers.length / paperAndPosterTeams.length).toFixed(1)
            : "0"

    const stats = [
        {
            title: "Paper and Poster Competition",
            value: paperAndPosterCompetition ? 1 : 0,
            icon: Trophy,
        },
        {
            title: "Total Team",
            value: paperAndPosterTeams.length,
            icon: Users,
        },
        {
            title: "Total Team Leader",
            value: paperAndPosterTeamLeaders.length,
            icon: UserRound,
        },
        {
            title: "Total Registration",
            value: paperAndPosterRegistrations.length,
            icon: ClipboardList,
        },
        {
            title: "Total Member",
            value: paperAndPosterMembers.length,
            icon: UserCheck,
        },
    ]

    if (isLoading) {
        return (
            <div className="text-white px-10 py-7">
                <p className="text-xl font-semibold">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Dashboard Admin Paper and Poster Competition
                </p>
                <p className="text-sm opacity-70 mt-1">
                    Monitor team, team leader, registration, and member data for
                    Paper and Poster Competition only.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon

                    return (
                        <div
                            key={index}
                            className="glass p-5 rounded-2xl hover:scale-[1.02] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-70">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold mt-2">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="glass p-3 rounded-xl">
                                    <Icon size={28} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {!paperAndPosterCompetition && (
                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm text-yellow-300">
                        Data Paper and Poster Competition belum ditemukan.
                        Pastikan nama competition mengandung kata "Paper and
                        Poster".
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="glass p-5 rounded-2xl lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-semibold text-lg">
                                Member Distribution by Team
                            </p>
                            <p className="text-sm opacity-70">
                                Total member pada masing-masing team Paper and
                                Poster
                            </p>
                        </div>

                        <Layers />
                    </div>

                    <div className="space-y-4">
                        {memberByTeam.length > 0 ? (
                            memberByTeam.map((team) => (
                                <div key={team.id_team}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <p>
                                            {team.name_team ||
                                                `Team ${team.id_team}`}
                                        </p>
                                        <p>{team.totalMember} Member</p>
                                    </div>

                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-[#36C2A1] rounded-full transition-all"
                                            style={{
                                                width: `${(team.totalMember /
                                                    maxMember) *
                                                    100
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm opacity-70">
                                Belum ada team yang terdaftar di Paper and
                                Poster Competition.
                            </p>
                        )}
                    </div>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <p className="font-semibold text-lg mb-1">
                        Registration Overview
                    </p>
                    <p className="text-sm opacity-70 mb-5">
                        Ringkasan pendaftaran khusus Paper and Poster
                        Competition
                    </p>

                    <div className="flex items-center justify-center">
                        <div className="relative w-44 h-44 rounded-full glass flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-4xl font-bold">
                                    {paperAndPosterRegistrations.length}
                                </p>
                                <p className="text-sm opacity-70">
                                    Registrations
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <p>Total Team</p>
                            <p>{paperAndPosterTeams.length}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Total Team Leader</p>
                            <p>{paperAndPosterTeamLeaders.length}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Avg Member / Team</p>
                            <p>{avgMemberPerTeam}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <p className="font-semibold text-lg mb-4">
                    Paper and Poster Team Summary
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3">No</th>
                                <th className="text-left py-3">Team</th>
                                <th className="text-left py-3">Total Member</th>
                                <th className="text-left py-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {memberByTeam.map((team, index) => (
                                <tr
                                    key={team.id_team}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3">{index + 1}</td>
                                    <td className="py-3">
                                        {team.name_team ||
                                            `Team ${team.id_team}`}
                                    </td>
                                    <td className="py-3">
                                        {team.totalMember} Member
                                    </td>
                                    <td className="py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${team.totalMember > 0
                                                ? "bg-green-500/20 text-green-300"
                                                : "bg-red-500/20 text-red-300"
                                                }`}
                                        >
                                            {team.totalMember > 0
                                                ? "Active"
                                                : "No Member"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {memberByTeam.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-5">
                            Belum ada data team untuk Paper and Poster
                            Competition.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home