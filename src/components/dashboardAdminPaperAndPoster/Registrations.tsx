import { useEffect, useMemo, useState } from "react"
import { ClipboardList, Eye, Pencil, X, Users, UserRound } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Toast from "../Toast"
import { isTokenExpired } from "../../utils/auth"

interface Competition {
    id_competition: number
    name_competition: string
    status_competition?: string
}

interface Registration {
    id_registration: number
    category_registration?: string
    status_registration?: string
    payment_status?: string
    payment_proof?: string
    id_team?: number
    id_team_leader?: number
    id_competition?: number
    createdAt?: string
    updatedAt?: string
}

interface Team {
    id_team: number
    name_team?: string
    team_name?: string
    institution?: string
    id_team_leader?: number
}

interface TeamLeader {
    id_team_leader: number
    name_team_leader?: string
    email_team_leader?: string
    phone_number?: string
}

const Registrations = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])

    const [selectedRegistration, setSelectedRegistration] =
        useState<Registration | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [form, setForm] = useState({
        status_registration: "PENDING",
        payment_status: "PENDING",
    })

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const PAPER_AND_POSTER_KEYWORD = "paper&poster"

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }

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

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)

            const [
                competitionsRes,
                registrationsRes,
                teamsRes,
                teamLeadersRes,
            ] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllRegistrations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTeams`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTeamLeaders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ])

            const competitionsData = await competitionsRes.json()
            const registrationsData = await registrationsRes.json()
            const teamsData = await teamsRes.json()
            const teamLeadersData = await teamLeadersRes.json()

            setCompetitions(
                normalizeArray<Competition>(competitionsData, "competitions")
            )
            setRegistrations(
                normalizeArray<Registration>(
                    registrationsData,
                    "registrations"
                )
            )
            setTeams(normalizeArray<Team>(teamsData, "teams"))
            setTeamLeaders(
                normalizeArray<TeamLeader>(teamLeadersData, "teamLeaders")
            )
        } catch (error) {
            console.error(error)
            setToast({
                message: "Failed to fetch registration data.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

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

    const getTeam = (registration: Registration) => {
        return teams.find(
            (team) =>
                Number(team.id_team) === Number(registration.id_team) ||
                Number(team.id_team_leader) ===
                Number(registration.id_team_leader)
        )
    }

    const getTeamName = (registration: Registration) => {
        const team = getTeam(registration)

        return (
            team?.team_name ||
            team?.name_team ||
            `Team ${registration.id_team || "-"}`
        )
    }

    const getInstitution = (registration: Registration) => {
        const team = getTeam(registration)

        return team?.institution || "-"
    }

    const getTeamLeader = (registration: Registration) => {
        return teamLeaders.find(
            (leader) =>
                Number(leader.id_team_leader) ===
                Number(registration.id_team_leader)
        )
    }

    const getTeamLeaderName = (registration: Registration) => {
        const leader = getTeamLeader(registration)

        return (
            leader?.name_team_leader ||
            `Team Leader ${registration.id_team_leader || "-"}`
        )
    }

    const openDetailModal = (registration: Registration) => {
        setSelectedRegistration(registration)
        setIsDetailModalOpen(true)
    }

    const openEditModal = (registration: Registration) => {
        setSelectedRegistration(registration)
        setForm({
            status_registration:
                registration.status_registration || "PENDING",
            payment_status: registration.payment_status || "PENDING",
        })
        setIsEditModalOpen(true)
    }

    const handleUpdateRegistration = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedRegistration) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateRegistration/${selectedRegistration.id_registration}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        status_registration: form.status_registration,
                        payment_status: form.payment_status,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to update registration.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Registration updated successfully.",
                type: "success",
            })

            setIsEditModalOpen(false)
            setSelectedRegistration(null)
            fetchData()
        } catch (error) {
            console.error(error)
            setToast({
                message: "Something went wrong.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const approvedRegistrations = useMemo(() => {
        return paperAndPosterRegistrations.filter(
            (registration) =>
                registration.payment_status === "APPROVED" ||
                registration.status_registration === "APPROVED"
        ).length
    }, [paperAndPosterRegistrations])

    const pendingRegistrations = useMemo(() => {
        return paperAndPosterRegistrations.filter(
            (registration) =>
                !registration.payment_status ||
                registration.payment_status === "PENDING"
        ).length
    }, [paperAndPosterRegistrations])

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Paper and Poster Registrations
                </p>
                <p className="text-sm opacity-70 mt-1">
                    Manage registration and payment status for Paper and Poster
                    Competition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <ClipboardList className="mb-3" />
                    <p className="text-sm opacity-70">Total Registration</p>
                    <p className="text-3xl font-bold mt-1">
                        {paperAndPosterRegistrations.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">Approved</p>
                    <p className="text-3xl font-bold mt-1">
                        {approvedRegistrations}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <UserRound className="mb-3" />
                    <p className="text-sm opacity-70">Pending</p>
                    <p className="text-3xl font-bold mt-1">
                        {pendingRegistrations}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <ClipboardList className="mb-3" />
                    <p className="text-sm opacity-70">Competition</p>
                    <p className="text-xl font-bold mt-1">
                        {paperAndPosterCompetition?.name_competition || "-"}
                    </p>
                </div>
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

            <div className="glass p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Registration List
                        </p>
                        <p className="text-sm opacity-70">
                            List pendaftaran khusus Paper and Poster
                            Competition.
                        </p>
                    </div>

                    <ClipboardList />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3 px-3">No</th>
                                <th className="text-left py-3 px-3">Team</th>
                                <th className="text-left py-3 px-3">
                                    Team Leader
                                </th>
                                <th className="text-left py-3 px-3">
                                    Institution
                                </th>
                                <th className="text-left py-3 px-3">
                                    Registration
                                </th>
                                <th className="text-left py-3 px-3">
                                    Payment
                                </th>
                                <th className="text-left py-3 px-3">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paperAndPosterRegistrations.map(
                                (registration, index) => (
                                    <tr
                                        key={registration.id_registration}
                                        className="border-b border-white/10"
                                    >
                                        <td className="py-3 px-3">
                                            {index + 1}
                                        </td>

                                        <td className="py-3 px-3 font-medium">
                                            {getTeamName(registration)}
                                        </td>

                                        <td className="py-3 px-3">
                                            {getTeamLeaderName(registration)}
                                        </td>

                                        <td className="py-3 px-3">
                                            {getInstitution(registration)}
                                        </td>

                                        <td className="py-3 px-3">
                                            <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300">
                                                {registration.status_registration ||
                                                    "PENDING"}
                                            </span>
                                        </td>

                                        <td className="py-3 px-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${registration.payment_status ===
                                                    "APPROVED"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : registration.payment_status ===
                                                        "REJECTED"
                                                        ? "bg-red-500/20 text-red-300"
                                                        : "bg-yellow-500/20 text-yellow-300"
                                                    }`}
                                            >
                                                {registration.payment_status ||
                                                    "PENDING"}
                                            </span>
                                        </td>

                                        <td className="py-3 px-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        openDetailModal(
                                                            registration
                                                        )
                                                    }
                                                    className="cursor-pointer glass p-2 rounded-lg"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            registration
                                                        )
                                                    }
                                                    className="cursor-pointer glass p-2 rounded-lg"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    {!isLoading &&
                        paperAndPosterRegistrations.length === 0 && (
                            <p className="text-center text-sm opacity-70 py-6">
                                No registration data found for Paper and Poster
                                Competition.
                            </p>
                        )}

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading registration data...
                        </p>
                    )}
                </div>
            </div>

            {isDetailModalOpen && selectedRegistration && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-3xl">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                Registration Detail
                            </p>

                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoBox
                                label="Team"
                                value={getTeamName(selectedRegistration)}
                            />

                            <InfoBox
                                label="Team Leader"
                                value={getTeamLeaderName(
                                    selectedRegistration
                                )}
                            />

                            <InfoBox
                                label="Institution"
                                value={getInstitution(selectedRegistration)}
                            />

                            <InfoBox
                                label="Category"
                                value={
                                    selectedRegistration.category_registration ||
                                    "-"
                                }
                            />

                            <InfoBox
                                label="Registration Status"
                                value={
                                    selectedRegistration.status_registration ||
                                    "PENDING"
                                }
                            />

                            <InfoBox
                                label="Payment Status"
                                value={
                                    selectedRegistration.payment_status ||
                                    "PENDING"
                                }
                            />

                            <InfoBox
                                label="Created At"
                                value={
                                    selectedRegistration.createdAt
                                        ? new Date(
                                            selectedRegistration.createdAt
                                        ).toLocaleString()
                                        : "-"
                                }
                            />

                            <InfoBox
                                label="Updated At"
                                value={
                                    selectedRegistration.updatedAt
                                        ? new Date(
                                            selectedRegistration.updatedAt
                                        ).toLocaleString()
                                        : "-"
                                }
                            />
                        </div>

                        <div className="mt-5 bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="font-medium">Payment Proof</p>

                            {selectedRegistration.payment_proof ? (
                                <a
                                    href={selectedRegistration.payment_proof}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-3 text-cyan-300 underline"
                                >
                                    View Payment Proof
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500 mt-3">
                                    No payment proof uploaded.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedRegistration && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                Update Registration
                            </p>

                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateRegistration}>
                            <div>
                                <p>Registration Status</p>
                                <select
                                    value={form.status_registration}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            status_registration:
                                                e.target.value,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <p>Payment Status</p>
                                <select
                                    value={form.payment_status}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            payment_status: e.target.value,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full glass px-5 py-3 text-center mt-6 rounded-xl ${isLoading
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                    }`}
                            >
                                {isLoading
                                    ? "Saving..."
                                    : "Update Registration"}
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

const InfoBox = ({
    label,
    value,
}: {
    label: string
    value?: string | number
}) => {
    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-white mt-2 break-all">{value || "-"}</p>
        </div>
    )
}

export default Registrations