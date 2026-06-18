import { useEffect, useMemo, useState } from "react"
import {
    ClipboardList,
    Eye,
    Pencil,
    Trash2,
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
}

const Registrations = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [selectedRegistration, setSelectedRegistration] =
        useState<Registration | null>(null)

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [paymentStatus, setPaymentStatus] = useState("PENDING")

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

    const fetchRegistrations = async () => {
        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllRegistrations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            setRegistrations(
                data.registrations || data.data || data.registration || data
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

    const fetchCompetitions = async () => {
        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            setCompetitions(data.competitions || data.data || data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

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
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRegistrations()
        fetchCompetitions()
        fetchTeamLeaders()
    }, [])

    const filteredRegistrations = useMemo(() => {
        return registrations.filter((registration) => {
            const keyword = search.toLowerCase()

            return (
                registration.category_registration
                    ?.toLowerCase()
                    .includes(keyword) ||
                registration.name_team?.toLowerCase().includes(keyword) ||
                registration.name_team_leader
                    ?.toLowerCase()
                    .includes(keyword) ||
                registration.name_competition?.toLowerCase().includes(keyword)
            )
        })
    }, [registrations, search])

    const approvedPayments = registrations.filter(
        (item) => item.payment_status === "APPROVED"
    ).length

    const pendingPayments = registrations.filter(
        (item) => item.payment_status === "PENDING"
    ).length

    const activeRegistrations = registrations.filter(
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

    const openDeleteModal = (registration: Registration) => {
        setSelectedRegistration(registration)
        setIsDeleteModalOpen(true)
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
                        id_team_leader:
                            selectedRegistration.id_team_leader,
                        id_competition:
                            selectedRegistration.id_competition,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to update payment status.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Payment status updated successfully.",
                type: "success",
            })

            setIsUpdateModalOpen(false)
            setSelectedRegistration(null)
            fetchRegistrations()
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

    const handleDelete = async () => {
        if (!selectedRegistration) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/deleteRegistration/${selectedRegistration.id_registration}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to delete registration.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Registration deleted successfully.",
                type: "success",
            })

            setIsDeleteModalOpen(false)
            setSelectedRegistration(null)
            fetchRegistrations()
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

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Registration Management
                </p>
                <p className="text-sm opacity-70 mt-1">
                    Manage registrations and verify payment status.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <ClipboardList className="mb-3" />
                    <p className="text-sm opacity-70">Total Registration</p>
                    <p className="text-3xl font-bold mt-1">
                        {registrations.length}
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
                            Registration List
                        </p>
                        <p className="text-sm opacity-70">
                            List of all registration data submitted by team leaders.
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
                                <th className="text-left py-3">Team Leader</th>
                                <th className="text-left py-3">Competition</th>
                                <th className="text-left py-3">Status</th>
                                <th className="text-left py-3">Payment</th>
                                <th className="text-left py-3">Proof</th>
                                <th className="text-left py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRegistrations.map((registration, index) => (
                                <tr
                                    key={registration.id_registration}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3">{index + 1}</td>

                                    <td className="py-3">
                                        {registration.category_registration}
                                    </td>

                                    <td className="py-3">
                                        {registration.name_team_leader ||
                                            `Leader ID ${registration.id_team_leader}`}
                                    </td>

                                    <td className="py-3">
                                        {registration.name_competition ||
                                            `Competition ID ${registration.id_competition}`}
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${registration.status_registration ===
                                                "ACTIVE"
                                                ? "bg-green-500/20 text-green-300"
                                                : "bg-red-500/20 text-red-300"
                                                }`}
                                        >
                                            {registration.status_registration}
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
                                                    openDetailModal(registration)
                                                }
                                                className="cursor-pointer glass p-2 rounded-lg"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    openUpdateModal(registration)
                                                }
                                                className="cursor-pointer glass p-2 rounded-lg"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    openDeleteModal(registration)
                                                }
                                                className="cursor-pointer glass p-2 rounded-lg text-red-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading registrations...
                        </p>
                    )}

                    {!isLoading && filteredRegistrations.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-6">
                            No registration data found.
                        </p>
                    )}
                </div>
            </div>

            {isDetailModalOpen && selectedRegistration && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-5">
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

                        <div className="space-y-3 text-sm">
                            <DetailRow
                                label="Registration ID"
                                value={selectedRegistration.id_registration}
                            />
                            <DetailRow
                                label="Category"
                                value={selectedRegistration.category_registration}
                            />
                            <DetailRow
                                label="Status"
                                value={selectedRegistration.status_registration}
                            />
                            <DetailRow
                                label="Payment Status"
                                value={selectedRegistration.payment_status}
                            />
                            <DetailRow
                                label="Team Leader"
                                value={teamLeaders.find((teamLeader) => teamLeader.id_team_leader === selectedRegistration.id_team_leader)?.name_team_leader || "-"}
                            />
                            <DetailRow
                                label="Competition"
                                value={competitions.find((competition) => competition.id_competition === selectedRegistration.id_competition)?.name_competition || "-"}
                            />
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
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpdatePaymentStatus}>
                            <div className="space-y-3 text-sm mb-5">
                                <DetailRow
                                    label="Category"
                                    value={
                                        selectedRegistration.category_registration
                                    }
                                />
                                <DetailRow
                                    label="Team Leader"
                                    value={
                                        selectedRegistration.name_team_leader ||
                                        selectedRegistration.id_team_leader
                                    }
                                />
                                <DetailRow
                                    label="Competition"
                                    value={
                                        selectedRegistration.name_competition ||
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

            {isDeleteModalOpen && selectedRegistration && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 size={30} className="text-red-400" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-center mt-4">
                            Delete Registration
                        </h2>

                        <p className="text-center text-white/70 mt-2">
                            Are you sure you want to delete this registration?
                        </p>

                        <p className="text-center text-sm text-red-300 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setSelectedRegistration(null)
                                }}
                                className="cursor-pointer flex-1 glass py-3 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="cursor-pointer flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl transition-all"
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </button>
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

const DetailRow = ({
    label,
    value,
}: {
    label: string
    value: string | number
}) => {
    return (
        <div className="flex justify-between gap-5 border-b border-white/10 pb-2">
            <p className="opacity-70">{label}</p>
            <p className="font-medium text-right">{value}</p>
        </div>
    )
}

export default Registrations