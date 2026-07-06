import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Trophy,
    Search,
    CircleCheck,
    CircleX,
    ArrowRight,
    X,
    Upload,
} from "lucide-react"
import { isTokenExpired } from "../../utils/auth"
import Toast from "../Toast"
import logoBusinessCase from '../../images/logo-business-case.png'
import logoCaseStudy from '../../images/logo-case-study.png'
import logoMudInnovation from '../../images/logo-mud-innovation.png'
import logoPaperandPoster from '../../images/logo-paper-and-poster.png'
import logoPetrosmart from '../../images/logo-petrosmart.png'
import logoWellStimulation from '../../images/logo-well-stimulation.png'

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

interface Competition {
    id_competition: number
    name_competition: string
    status_competition: "ACTIVE" | "NOT ACTIVE" | string
    id_platform: number
}

interface Registration {
    id_registration: number
    category_registration: string
    status_registration: string
    payment_proof: string
    payment_status: string
    id_team_leader: number
    id_competition: number
}

const getCompetitionLogo = (name: string) => {
    const normalizedName = name.toLowerCase()

    if (normalizedName.includes("business")) return logoBusinessCase
    if (normalizedName.includes("case study")) return logoCaseStudy
    if (normalizedName.includes("mud")) return logoMudInnovation
    if (normalizedName.includes("paper") || normalizedName.includes("poster")) return logoPaperandPoster
    if (normalizedName.includes("petrosmart")) return logoPetrosmart
    if (normalizedName.includes("well")) return logoWellStimulation

    return logoBusinessCase
}

const Competitions = () => {
    const navigate = useNavigate()

    const [registrations, setRegistrations] = useState<Registration[]>([])

    const [user, setUser] = useState<User | null>(null)
    const [team, setTeam] = useState<Team | null>(null)
    const [member, setMember] = useState<any[] | null>(null)
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCompetition, setSelectedCompetition] =
        useState<Competition | null>(null)
    const [paymentProof, setPaymentProof] = useState<File | null>(null)
    const [submitLoading, setSubmitLoading] = useState(false)

    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

    const ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ]

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (!token || isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/team-leader/sign-in")
        }
    }, [navigate])

    useEffect(() => {
        const userData = localStorage.getItem("user")

        if (userData) {
            setUser(JSON.parse(userData))
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
    }, [user])

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
    }, [team])

    const getMyCompetition = async (idTeamLeader: string | number) => {
        const token = sessionStorage.getItem("token")

        try {
            setLoading(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL
                }/getRegistrationByIdTeamLeader/${idTeamLeader}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.status === 202 || response.status === 404) {
                setRegistrations([])
                return
            }

            const data = await response.json()
            setRegistrations(data.registration || [])
        } catch (error) {
            console.error("Failed to fetch my competition:", error)
            setRegistrations([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem("user")

        if (userData) {
            const parsedUser = JSON.parse(userData)

            if (parsedUser?.id_team_leader) {
                getMyCompetition(parsedUser.id_team_leader)
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }, [isModalOpen])

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        const getCompetitionsData = async () => {
            try {
                setLoading(true)

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (response.status === 202) {
                    setCompetitions([])
                    return
                }

                const data = await response.json()
                setCompetitions(data.competitions || [])
            } catch (error) {
                console.error("Failed to fetch competitions:", error)
                setCompetitions([])
            } finally {
                setLoading(false)
            }
        }

        getCompetitionsData()
    }, [isModalOpen])

    const filteredCompetitions = competitions.filter((competition) =>
        competition.name_competition
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const openRegistrationModal = (competition: Competition) => {
        setSelectedCompetition(competition)
        setPaymentProof(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedCompetition(null)
        setPaymentProof(null)
    }

    const handlePaymentProofChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setToast({
                message:
                    "Format file tidak didukung. Silakan upload gambar JPG, JPEG, PNG, atau WEBP.",
                type: "error",
            })

            e.target.value = ""
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setToast({
                message:
                    "Ukuran gambar maksimal 2 MB. Silakan upload gambar dengan ukuran yang lebih kecil.",
                type: "error",
            })

            e.target.value = ""
            return
        }

        setPaymentProof(file)
    }

    const handleSubmitRegistration = async () => {
        const token = sessionStorage.getItem("token")

        if (!selectedCompetition) {
            setToast({ message: "Competition not found", type: "error" })
            return
        }

        if (!user?.id_team_leader) {
            setToast({ message: "Team leader data not found", type: "error" })
            return
        }

        if (!paymentProof) {
            setToast({ message: "Please upload payment proof", type: "error" })
            return
        }

        try {
            setSubmitLoading(true)

            const formData = new FormData()
            formData.append("category_registration", "COMPETITION")
            formData.append("status_registration", "ACTIVE")
            formData.append("payment_status", "PENDING")
            formData.append("id_team_leader", String(user.id_team_leader))
            formData.append(
                "id_competition",
                String(selectedCompetition.id_competition)
            )
            formData.append("payment_proof", paymentProof)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/createRegistration`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            )

            const result = await response.json()

            if (!response.ok) {
                setToast({ message: result.message || "Failed to register competition", type: "error" })
                return
            }

            setToast({ message: "Registration submitted successfully!", type: "success" })
            closeModal()
        } catch (error) {
            console.error("Failed to submit registration:", error)
            setToast({ message: "Something went wrong. Please try again.", type: "error" })
        } finally {
            setSubmitLoading(false)
        }
    }

    console.log("registrations", registrations)

    return (
        <div className="min-h-screen px-10 py-7 text-white">
            <div className="flex flex-col gap-8">
                <p className="font-semibold text-white text-4xl font-garamond">
                    All Competitions
                </p>

                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search competition..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-[#7288AE]/30 bg-[#111844]/70 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-gray-400 focus:border-[#EAE0CF]"
                    />
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-56 animate-pulse rounded-3xl border border-[#7288AE]/20 bg-[#111844]/60"
                            />
                        ))}
                    </div>
                ) : filteredCompetitions.length === 0 ? (
                    <div className="flex min-h-75 flex-col items-center justify-center rounded-3xl border border-dashed border-[#7288AE]/40 bg-[#111844]/40 text-center">
                        <Trophy className="mb-4 h-12 w-12 text-gray-500" />

                        <h2 className="text-xl font-semibold text-white">
                            No competitions found
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            There are no competitions available at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredCompetitions.map((competition) => {
                            const isActive =
                                competition.status_competition === "ACTIVE"

                            return (
                                <div
                                    key={competition.id_competition}
                                    className="group rounded-3xl border border-[#7288AE]/25 bg-[#111844]/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#EAE0CF]/60"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4B5694]/40 p-3">
                                            <img
                                                src={getCompetitionLogo(competition.name_competition)}
                                                alt={`${competition.name_competition} logo`}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        <div
                                            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isActive
                                                ? "bg-green-500/15 text-green-300"
                                                : "bg-red-500/15 text-red-300"
                                                }`}
                                        >
                                            {isActive ? (
                                                <CircleCheck className="h-4 w-4" />
                                            ) : (
                                                <CircleX className="h-4 w-4" />
                                            )}

                                            {competition.status_competition}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h2 className="text-2xl font-semibold text-white">
                                            {competition.name_competition}
                                        </h2>

                                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                                            Register your team and participate
                                            in this competition through the
                                            available platform.
                                        </p>
                                    </div>

                                    <button
                                        disabled={!isActive || registrations.length > 0 || !team || !member || member.length === 0}
                                        onClick={() =>
                                            openRegistrationModal(competition)
                                        }
                                        className={`cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all ${!isActive || registrations.length > 0 || !team || !member || member.length === 0
                                            ? "cursor-not-allowed bg-gray-700/60 text-gray-400"
                                            : "bg-[#EAE0CF] text-[#111844] hover:bg-white"
                                            }`}
                                    >
                                        {!team
                                            ? "Please create team first"
                                            : !member || member.length === 0
                                                ? "Please add member first"
                                                : registrations.length > 0
                                                    ? "Cannot register again"
                                                    : isActive
                                                        ? "Register Now"
                                                        : "Registration Closed"}

                                        {isActive && team && member && member.length > 0 && registrations.length === 0 && (
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        )}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && selectedCompetition && (
                <div className="fixed top-0 bottom-0 right-0 left-0 z-50 flex items-center justify-center bg-black/70 px-4 py-5 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#7288AE]/30 bg-[#111844] p-5 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Competition Registration
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Complete your registration by uploading
                                    payment proof.
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="cursor-pointer rounded-full bg-white/10 p-2 text-gray-300 hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-300">
                                    Competition
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedCompetition.name_competition
                                    }
                                    disabled
                                    className="mt-2 w-full rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300">
                                    Category Registration
                                </label>

                                <input
                                    type="text"
                                    value="COMPETITION"
                                    disabled
                                    className="mt-2 w-full rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-white outline-none"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-300">
                                        Registration Status
                                    </label>

                                    <input
                                        type="text"
                                        value="ACTIVE"
                                        disabled
                                        className="mt-2 w-full rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300">
                                        Payment Status
                                    </label>

                                    <input
                                        type="text"
                                        value="PENDING"
                                        disabled
                                        className="mt-2 w-full rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-300">
                                        Team Leader ID
                                    </label>

                                    <input
                                        type="text"
                                        value={user?.id_team_leader || ""}
                                        disabled
                                        className="mt-2 w-full rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300">
                                        Competition ID
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedCompetition.id_competition
                                        }
                                        disabled
                                        className="mt-2 w-full rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300">
                                    Payment Proof
                                </label>

                                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#7288AE]/50 bg-[#0B102F] px-4 py-6 text-center hover:border-[#EAE0CF]">
                                    <Upload className="mb-3 h-8 w-8 text-[#EAE0CF]" />

                                    <p className="text-sm font-medium text-white">
                                        {paymentProof
                                            ? paymentProof.name
                                            : "Click to upload payment proof"}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        JPG, JPEG, PNG, atau WEBP (maks. 2 MB)
                                    </p>

                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
                                        onChange={handlePaymentProofChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="mt-7 flex gap-3">
                            <button
                                onClick={closeModal}
                                className="cursor-pointer w-full rounded-2xl border border-[#7288AE]/40 py-3 text-sm font-semibold text-white hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmitRegistration}
                                disabled={submitLoading}
                                className="cursor-pointer w-full rounded-2xl bg-[#EAE0CF] py-3 text-sm font-semibold text-[#111844] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitLoading
                                    ? "Submitting..."
                                    : "Submit Registration"}
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

export default Competitions