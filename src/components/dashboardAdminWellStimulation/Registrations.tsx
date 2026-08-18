import { useEffect, useMemo, useState } from "react"
import {
    ClipboardList,
    Eye,
    Pencil,
    X,
    CheckCircle,
    Clock,
    Users,
} from "lucide-react"
import Toast from "../Toast"
import { isTokenExpired } from "../../utils/auth"
import { useNavigate } from "react-router-dom"

interface Registration {
    id_registration: number
    category_registration: string
    status_registration: string
    payment_status: string
    payment_proof?: string
    id_team_leader: number
    id_competition: number
    id_team?: number
    name_team?: string
    name_team_leader?: string
    email_team_leader?: string
    name_competition?: string
}

interface Competition {
    id_competition: number
    name_competition: string
    status_competition: string
    id_platform?: number
}

interface TeamLeader {
    id_team_leader: number
    name_team_leader?: string
    email_team_leader?: string
}

interface Team {
    id_team: number
    team_name?: string
    name_team?: string
    id_team_leader?: number
}

interface DiscountRedemption {
    id_team_leader: number
    id_registration: number
    transaction_amount: number
    discount_amount: number
    final_amount: number
    redeemed_at: string
}

interface DiscountCode {
    _id: string
    code: string
    discount_type: "PERCENTAGE" | "FIXED"
    discount_value: number
    start_date: string
    end_date: string
    usage_limit: number | null
    used_count: number
    redeemed_by: DiscountRedemption[]
    is_active: boolean
}

const Registrations = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [selectedRegistration, setSelectedRegistration] =
        useState<Registration | null>(null)

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState("PENDING")

    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const WELL_STIMULATION_KEYWORD = "wellstimulation"

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

    const getTeamName = (registration: Registration) => {
        return (
            registration.name_team ||
            teams.find(
                (team) =>
                    team.id_team === registration.id_team ||
                    team.id_team_leader === registration.id_team_leader
            )?.team_name ||
            teams.find(
                (team) =>
                    team.id_team === registration.id_team ||
                    team.id_team_leader === registration.id_team_leader
            )?.name_team ||
            "-"
        )
    }

    const getTeamLeaderName = (registration: Registration) => {
        return (
            registration.name_team_leader ||
            teamLeaders.find(
                (teamLeader) =>
                    teamLeader.id_team_leader === registration.id_team_leader
            )?.name_team_leader ||
            "-"
        )
    }

    const getTeamLeaderEmail = (registration: Registration) => {
        return (
            registration.email_team_leader ||
            teamLeaders.find(
                (teamLeader) =>
                    teamLeader.id_team_leader === registration.id_team_leader
            )?.email_team_leader ||
            "-"
        )
    }

    const fetchData = async () => {
        try {
            setIsLoading(true)

            const headers = {
                Authorization: `Bearer ${token}`,
            }

            const [
                registrationRes,
                competitionRes,
                teamLeaderRes,
                teamRes,
                discountRes,
            ] = await Promise.all([
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllRegistrations`,
                    { headers }
                ),

                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
                    { headers }
                ),

                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllTeamLeaders`,
                    { headers }
                ),

                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllTeams`,
                    { headers }
                ),

                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getDiscountCodes`,
                    { headers }
                ),
            ])

            const registrationData = await registrationRes.json()
            const competitionData = await competitionRes.json()
            const teamLeaderData = await teamLeaderRes.json()
            const teamData = await teamRes.json()
            const discountData = await discountRes.json()

            setRegistrations(
                normalizeArray<Registration>(
                    registrationData,
                    "registrations"
                )
            )
            setCompetitions(
                normalizeArray<Competition>(competitionData, "competitions")
            )
            setTeamLeaders(
                normalizeArray<TeamLeader>(teamLeaderData, "teamLeaders")
            )
            setTeams(normalizeArray<Team>(teamData, "teams"))
            setDiscountCodes(
                normalizeArray<DiscountCode>(discountData, "discountCodes")
            )
        } catch (error) {
            console.error(error)
            setToast({
                message: "Failed to fetch registrations.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const wellStimulationCompetition = useMemo(() => {
        return competitions.find((competition) =>
            competition.name_competition
                ?.toLowerCase()
                .replace(/\s+/g, "")
                .includes(WELL_STIMULATION_KEYWORD)
        )
    }, [competitions])

    const wellStimulationRegistrations = useMemo(() => {
        if (!wellStimulationCompetition) return []

        return registrations.filter(
            (registration) =>
                registration.id_competition ===
                wellStimulationCompetition.id_competition
        )
    }, [registrations, wellStimulationCompetition])

    const filteredRegistrations = useMemo(() => {
        const keyword = search.toLowerCase()

        return wellStimulationRegistrations.filter((registration) => {
            const teamName = getTeamName(registration).toLowerCase()
            const teamLeaderName = getTeamLeaderName(registration).toLowerCase()
            const teamLeaderEmail = getTeamLeaderEmail(registration).toLowerCase()

            return (
                registration.category_registration
                    ?.toLowerCase()
                    .includes(keyword) ||
                teamName.includes(keyword) ||
                teamLeaderName.includes(keyword) ||
                teamLeaderEmail.includes(keyword)
            )
        })
    }, [wellStimulationRegistrations, search, teams, teamLeaders])

    const approvedPayments = wellStimulationRegistrations.filter(
        (item) => item.payment_status === "APPROVED"
    ).length

    const pendingPayments = wellStimulationRegistrations.filter(
        (item) => item.payment_status === "PENDING"
    ).length

    const activeRegistrations = wellStimulationRegistrations.filter(
        (item) => item.status_registration === "ACTIVE"
    ).length

    const openDetailModal = (registration: Registration) => {
        setSelectedRegistration(registration)
        setIsDetailModalOpen(true)
    }

    const openUpdateModal = (registration: Registration) => {
        setSelectedRegistration(registration)
        setPaymentStatus(registration.payment_status || "PENDING")
        setIsUpdateModalOpen(true)
    }

    const closeDetailModal = () => {
        setSelectedRegistration(null)
        setIsDetailModalOpen(false)
    }

    const closeUpdateModal = () => {
        setSelectedRegistration(null)
        setIsUpdateModalOpen(false)
    }

    const handleUpdatePaymentStatus = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedRegistration) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateRegistration/${selectedRegistration.id_registration}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        category_registration:
                            selectedRegistration.category_registration,
                        status_registration:
                            selectedRegistration.status_registration,
                        payment_status: paymentStatus,
                        id_team_leader: selectedRegistration.id_team_leader,
                        id_competition: selectedRegistration.id_competition,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message:
                        data.error || "Failed to update payment status.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Payment status updated successfully.",
                type: "success",
            })

            closeUpdateModal()
            fetchData()
        } catch (error) {
            console.error(error)
            setToast({
                message: "Something wrong.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getDiscountByRegistrationId = (
        registrationId: number,
        teamLeaderId: number
    ) => {
        for (const discount of discountCodes) {
            const redemption =
                discount.redeemed_by?.find(
                    (item) =>
                        Number(
                            item.id_registration
                        ) ===
                        Number(registrationId) &&
                        Number(
                            item.id_team_leader
                        ) ===
                        Number(teamLeaderId)
                )

            if (redemption) {
                return {
                    discount,
                    redemption,
                }
            }
        }

        return null
    }

    const formatRupiah = (
        amount: number
    ) => {
        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }
        ).format(amount)
    }

    const formatDate = (
        date: string
    ) => {
        return new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone: "Asia/Jakarta",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        ).format(new Date(date))
    }

    const selectedRegistrationDiscount =
        selectedRegistration
            ? getDiscountByRegistrationId(
                selectedRegistration.id_registration,
                selectedRegistration.id_team_leader
            )
            : null

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Well Stimulation Registration Management
                </p>
                <p className="text-sm opacity-70 mt-1">
                    Manage registrations and verify payment status for
                    Well Stimulation Competition only.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <ClipboardList className="mb-3" />
                    <p className="text-sm opacity-70">Total Registration</p>
                    <p className="text-3xl font-bold mt-1">
                        {wellStimulationRegistrations.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <CheckCircle className="mb-3" />
                    <p className="text-sm opacity-70">Approved Payment</p>
                    <p className="text-3xl font-bold mt-1">
                        {approvedPayments}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Clock className="mb-3" />
                    <p className="text-sm opacity-70">Pending Payment</p>
                    <p className="text-3xl font-bold mt-1">
                        {pendingPayments}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">Active Registration</p>
                    <p className="text-3xl font-bold mt-1">
                        {activeRegistrations}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Well Stimulation Registration List
                        </p>
                        <p className="text-sm opacity-70">
                            List of team leaders who registered for Well Stimulation
                            Competition.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search registration..."
                        className="w-full md:w-72 px-4 py-2 rounded-lg bg-white text-black"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3">No</th>
                                <th className="text-left py-3">Category</th>
                                <th className="text-left py-3">Team</th>
                                <th className="text-left py-3">Team Leader</th>
                                <th className="text-left py-3">Status</th>
                                <th className="text-left py-3">Payment</th>
                                <th className="text-left py-3">Proof</th>
                                <th className="text-left py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRegistrations.map(
                                (registration, index) => (
                                    <tr
                                        key={registration.id_registration}
                                        className="border-b border-white/10"
                                    >
                                        <td className="py-3">{index + 1}</td>

                                        <td className="py-3">
                                            {
                                                registration.category_registration
                                            }
                                        </td>

                                        <td className="py-3">
                                            {getTeamName(registration)}
                                        </td>

                                        <td className="py-3">
                                            {getTeamLeaderName(registration)}
                                        </td>

                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${registration.status_registration ===
                                                    "ACTIVE"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : "bg-red-500/20 text-red-300"
                                                    }`}
                                            >
                                                {
                                                    registration.status_registration
                                                }
                                            </span>
                                        </td>

                                        <td className="py-3">
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
                                                {registration.payment_status}
                                            </span>
                                        </td>

                                        <td className="py-3">
                                            {registration.payment_proof ? (
                                                <span className="text-[#36C2A1]">
                                                    Uploaded
                                                </span>
                                            ) : (
                                                <span className="opacity-60">
                                                    No proof
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3">
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
                                                        openUpdateModal(
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

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading registrations...
                        </p>
                    )}

                    {!isLoading && filteredRegistrations.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-6">
                            No Well Stimulation registration data found.
                        </p>
                    )}
                </div>
            </div>

            {isDetailModalOpen && selectedRegistration && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl h-[95%] w-full max-w-lg overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-xl font-semibold">
                                Registration Detail
                            </p>

                            <button
                                onClick={closeDetailModal}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <DetailRow
                                label="Registration ID"
                                value={selectedRegistration.id_registration}
                            />
                            <DetailRow
                                label="Category"
                                value={
                                    selectedRegistration.category_registration
                                }
                            />
                            <DetailRow
                                label="Team"
                                value={getTeamName(selectedRegistration)}
                            />
                            <DetailRow
                                label="Team Leader"
                                value={getTeamLeaderName(selectedRegistration)}
                            />
                            <DetailRow
                                label="Email Team Leader"
                                value={getTeamLeaderEmail(selectedRegistration)}
                            />
                            <DetailRow
                                label="Competition"
                                value={
                                    selectedRegistration.name_competition ||
                                    wellStimulationCompetition?.name_competition ||
                                    "-"
                                }
                            />
                            <DetailRow
                                label="Registration Status"
                                value={
                                    selectedRegistration.status_registration
                                }
                            />
                            <DetailRow
                                label="Payment Status"
                                value={selectedRegistration.payment_status}
                            />

                            <div className="mt-6">
                                <p className="mb-3 font-semibold">
                                    Discount Information
                                </p>

                                {selectedRegistrationDiscount ? (
                                    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Discount Status
                                                </p>

                                                <p className="mt-1 font-semibold text-green-300">
                                                    Discount Applied
                                                </p>
                                            </div>

                                            <span className="rounded-lg bg-green-500/15 px-3 py-1 font-mono text-sm font-semibold text-green-300">
                                                {
                                                    selectedRegistrationDiscount
                                                        .discount.code
                                                }
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <DetailRow
                                                label="Discount Type"
                                                value={
                                                    selectedRegistrationDiscount
                                                        .discount
                                                        .discount_type ===
                                                        "PERCENTAGE"
                                                        ? "Percentage"
                                                        : "Fixed Amount"
                                                }
                                            />

                                            <DetailRow
                                                label="Discount Value"
                                                value={
                                                    selectedRegistrationDiscount
                                                        .discount
                                                        .discount_type ===
                                                        "PERCENTAGE"
                                                        ? `${selectedRegistrationDiscount.discount.discount_value}%`
                                                        : formatRupiah(
                                                            selectedRegistrationDiscount
                                                                .discount
                                                                .discount_value
                                                        )
                                                }
                                            />

                                            <DetailRow
                                                label="Original Amount"
                                                value={formatRupiah(
                                                    selectedRegistrationDiscount
                                                        .redemption
                                                        .transaction_amount
                                                )}
                                            />

                                            <DetailRow
                                                label="Discount Amount"
                                                value={`-${formatRupiah(
                                                    selectedRegistrationDiscount
                                                        .redemption
                                                        .discount_amount
                                                )}`}
                                            />

                                            <DetailRow
                                                label="Final Amount"
                                                value={formatRupiah(
                                                    selectedRegistrationDiscount
                                                        .redemption
                                                        .final_amount
                                                )}
                                            />

                                            <DetailRow
                                                label="Redeemed At"
                                                value={formatDate(
                                                    selectedRegistrationDiscount
                                                        .redemption
                                                        .redeemed_at
                                                )}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Discount Status
                                                </p>

                                                <p className="mt-1 font-semibold text-gray-300">
                                                    No Discount Used
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-gray-500/15 px-3 py-1 text-xs font-semibold text-gray-300">
                                                Not Applied
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedRegistration.payment_proof && (
                            <div className="mt-5">
                                <p className="font-semibold mb-2">
                                    Payment Proof
                                </p>

                                <img
                                    src={selectedRegistration.payment_proof}
                                    alt="Payment Proof"
                                    className="w-full max-h-72 object-contain rounded-xl bg-white"
                                />

                                <a
                                    href={selectedRegistration.payment_proof}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-3 text-[#36C2A1] underline"
                                >
                                    Open Payment Proof
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isUpdateModalOpen && selectedRegistration && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-xl font-semibold">
                                Update Payment Status
                            </p>

                            <button
                                onClick={closeUpdateModal}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpdatePaymentStatus}>
                            <div className="space-y-3 text-sm mb-5">
                                <DetailRow
                                    label="Team"
                                    value={getTeamName(selectedRegistration)}
                                />
                                <DetailRow
                                    label="Team Leader"
                                    value={getTeamLeaderName(
                                        selectedRegistration
                                    )}
                                />
                                <DetailRow
                                    label="Competition"
                                    value={
                                        selectedRegistration.name_competition ||
                                        wellStimulationCompetition
                                            ?.name_competition ||
                                        selectedRegistration.id_competition
                                    }
                                />
                            </div>

                            <div>
                                <p>Payment Status</p>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) =>
                                        setPaymentStatus(e.target.value)
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
                                    ? "Updating..."
                                    : "Update Payment Status"}
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

const DetailRow = ({
    label,
    value,
}: {
    label: string
    value?: string | number
}) => {
    return (
        <div className="flex justify-between gap-5 border-b border-white/10 pb-2">
            <p className="opacity-70">{label}</p>
            <p className="font-medium text-right">{value ?? "-"}</p>
        </div>
    )
}

export default Registrations