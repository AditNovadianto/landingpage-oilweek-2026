import { useEffect, useMemo, useState } from "react"
import {
    Trophy,
    Users,
    UserRound,
    ClipboardList,
    Layers,
    UserCheck,
} from "lucide-react"
import { isTokenExpired } from "../../utils/auth"
import { useNavigate } from "react-router-dom"

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

    useEffect(() => {
        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
        }
    }, [])

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
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`, { headers }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTeamLeaders`, { headers }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTeams`, { headers }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllMembers`, { headers }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllRegistrations`, { headers }),
            ])

            const competitionsData = await competitionsRes.json()
            const teamLeadersData = await teamLeadersRes.json()
            const teamsData = await teamsRes.json()
            const membersData = await membersRes.json()
            const registrationsData = await registrationsRes.json()

            setCompetitions(competitionsData.competitions || competitionsData.data || competitionsData)
            setTeamLeaders(teamLeadersData.teamLeaders || teamLeadersData.data || teamLeadersData)
            setTeams(teamsData.teams || teamsData.data || teamsData)
            setMembers(membersData.members || membersData.data || membersData)
            setRegistrations(registrationsData.registrations || registrationsData.data || registrationsData)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const memberByTeam = useMemo(() => {
        return teams.map((team) => {
            const totalMember = members.filter(
                (member) => member.id_team === team.id_team
            ).length

            return {
                ...team,
                totalMember,
            }
        })
    }, [teams, members])

    const maxMember = Math.max(...memberByTeam.map((team) => team.totalMember), 1)

    const stats = [
        {
            title: "Total Competition",
            value: competitions.length,
            icon: Trophy,
        },
        {
            title: "Total Team",
            value: teams.length,
            icon: Users,
        },
        {
            title: "Total Team Leader",
            value: teamLeaders.length,
            icon: UserRound,
        },
        {
            title: "Total Registration",
            value: registrations.length,
            icon: ClipboardList,
        },
        {
            title: "Total Member",
            value: members.length,
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
                <p className="text-2xl font-bold italic">Dashboard Overview</p>
                <p className="text-sm opacity-70 mt-1">
                    Monitor competition, team, registration, and member insights.
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="glass p-5 rounded-2xl lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-semibold text-lg">
                                Member Distribution by Team
                            </p>
                            <p className="text-sm opacity-70">
                                Total member pada masing-masing team
                            </p>
                        </div>

                        <Layers />
                    </div>

                    <div className="space-y-4">
                        {memberByTeam.length > 0 ? (
                            memberByTeam.map((team) => (
                                <div key={team.id_team}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <p>{team.name_team || `Team ${team.id_team}`}</p>
                                        <p>{team.totalMember} Member</p>
                                    </div>

                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-[#36C2A1] rounded-full transition-all"
                                            style={{
                                                width: `${(team.totalMember / maxMember) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm opacity-70">
                                Belum ada data team.
                            </p>
                        )}
                    </div>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <p className="font-semibold text-lg mb-1">
                        Registration Ratio
                    </p>
                    <p className="text-sm opacity-70 mb-5">
                        Perbandingan total registration dengan total team
                    </p>

                    <div className="flex items-center justify-center">
                        <div className="relative w-44 h-44 rounded-full glass flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-4xl font-bold">
                                    {registrations.length}
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
                            <p>{teams.length}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Total Competition</p>
                            <p>{competitions.length}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Avg Member / Team</p>
                            <p>
                                {teams.length > 0
                                    ? (members.length / teams.length).toFixed(1)
                                    : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <p className="font-semibold text-lg mb-4">
                    Team Member Summary
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
                                        {team.name_team || `Team ${team.id_team}`}
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
                            Belum ada data team.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home