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
    CreditCard,
    Landmark,
    CalendarDays,
    BadgeDollarSign,
    Wallet,
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
    twibbon?: string | null
    following_instagram?: string | null
    // following_linkedin?: string | null
    following_tiktok?: string | null
    instagram_story?: string | null
    repost_competition_instagram?: string | null
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

interface RedeemedDiscount {
    discount_code: string
    discount_type: "PERCENTAGE" | "FIXED"
    discount_value: number
    transaction_amount: number
    discount_amount: number
    final_amount: number
}

const getPaymentDetail = (competitionName: string) => {
    const name = competitionName.toLowerCase()

    if (
        name.includes("bcc") ||
        name.includes("business case")
    ) {
        return {
            type: "BCC",
            periods: [
                {
                    label: "Early Registration",
                    date: "20 - 25 July",
                    price: "Rp30.000 / $2"
                },
                {
                    label: "Normal Registration",
                    date: "26 July - 11 September",
                    price: "Rp50.000 / $3"
                },
                {
                    label: "Semi Final",
                    date: "23 - 28 September",
                    price: "Rp150.000 / $8"
                }
            ]
        }
    }

    return {
        type: "General Competition",
        periods: [
            {
                label: "Early Registration",
                date: "20 - 25 July",
                price: "Rp175.000 / $10"
            },
            {
                label: "Normal Registration",
                date: "26 July - 11 September",
                price: "Rp200.000 / $12"
            }
        ]
    }
}

const getCurrentRegistrationAmount = (competitionName: string) => {
    const name = competitionName.toLowerCase()
    const now = new Date()

    const earlyStart = new Date("2026-07-20T00:00:00")
    const earlyEnd = new Date("2026-07-25T23:59:59")

    const normalStart = new Date("2026-07-26T00:00:00")
    const normalEnd = new Date("2026-09-11T23:59:59")

    const semiFinalStart = new Date("2026-09-23T00:00:00")
    const semiFinalEnd = new Date("2026-09-28T23:59:59")

    const isBusinessCase =
        name.includes("bcc") ||
        name.includes("business case")

    if (isBusinessCase) {
        if (now >= earlyStart && now <= earlyEnd) {
            return 30000
        }

        if (now >= normalStart && now <= normalEnd) {
            return 50000
        }

        if (
            now >= semiFinalStart &&
            now <= semiFinalEnd
        ) {
            return 150000
        }

        return null
    }

    if (now >= earlyStart && now <= earlyEnd) {
        return 175000
    }

    if (now >= normalStart && now <= normalEnd) {
        return 200000
    }

    return null
}

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount)
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

interface MyCompetitionProps {
    setSection: React.Dispatch<React.SetStateAction<string>>
}

const Competitions: React.FC<MyCompetitionProps> = ({ setSection }) => {
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

    const [discountCode, setDiscountCode] = useState("")
    const [redeemLoading, setRedeemLoading] =
        useState(false)

    const [redeemedDiscount, setRedeemedDiscount] =
        useState<RedeemedDiscount | null>(null)

    const registrationAmount = selectedCompetition
        ? getCurrentRegistrationAmount(
            selectedCompetition.name_competition
        )
        : null

    const finalRegistrationAmount =
        redeemedDiscount?.final_amount ??
        registrationAmount

    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

    const ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ]

    const profileFileFields = [
        {
            label: "Twibbon",
            value: user?.twibbon,
        },
        {
            label: "Following Instagram",
            value: user?.following_instagram,
        },
        // {
        //     label: "Following LinkedIn",
        //     value: user?.following_linkedin,
        // },
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
    ]

    const isProfileComplete = profileFileFields.every((field) =>
        Boolean(field.value)
    )

    const missingProfileFiles = profileFileFields
        .filter((field) => !field.value)
        .map((field) => field.label)

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

    const openRegistrationModal = (
        competition: Competition
    ) => {
        setSelectedCompetition(competition)
        setPaymentProof(null)

        setDiscountCode("")
        setRedeemedDiscount(null)

        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedCompetition(null)
        setPaymentProof(null)

        setDiscountCode("")
        setRedeemedDiscount(null)
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

    const handleRedeemDiscountCode = async () => {
        const token = sessionStorage.getItem("token")

        if (!discountCode.trim()) {
            setToast({
                message: "Please enter discount code",
                type: "error",
            })
            return
        }

        if (!user?.id_team_leader) {
            setToast({
                message: "Team leader data not found",
                type: "error",
            })
            return
        }

        if (registrationAmount === null) {
            setToast({
                message:
                    "Registration fee is not available for the current period",
                type: "error",
            })
            return
        }

        try {
            setRedeemLoading(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL
                }/redeemDiscountCode`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        code: discountCode.trim(),
                        id_team_leader: Number(
                            user.id_team_leader
                        ),
                        transaction_amount:
                            registrationAmount,
                    }),
                }
            )

            const result = await response.json()

            if (!response.ok) {
                setRedeemedDiscount(null)

                setToast({
                    message:
                        result.message ||
                        "Failed to redeem discount code",
                    type: "error",
                })

                return
            }

            setRedeemedDiscount(result.data)

            setToast({
                message:
                    "Discount code redeemed successfully!",
                type: "success",
            })
        } catch (error) {
            console.error(
                "Failed to redeem discount code:",
                error
            )

            setToast({
                message:
                    "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setRedeemLoading(false)
        }
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

                {!isProfileComplete && (
                    <div className="rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-yellow-100">
                        <p className="font-semibold">
                            Complete your profile first
                        </p>

                        <p className="mt-1 text-sm text-yellow-100/80">
                            You cannot register for any competition until all
                            profile upload files are completed.
                        </p>

                        <p className="mt-2 text-xs text-yellow-100/70">
                            Missing: {missingProfileFiles.join(", ")}
                        </p>

                        <button
                            onClick={() => setSection("profile")}
                            className="cursor-pointer mt-3 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-[#111844] hover:bg-yellow-300"
                        >
                            Go to My Profile
                        </button>
                    </div>
                )}

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
                                        disabled={!isProfileComplete || !isActive || registrations.length > 0 || !team || !member || member.length === 0}
                                        onClick={() =>
                                            openRegistrationModal(competition)
                                        }
                                        className={`cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all ${!isProfileComplete || !isActive || registrations.length > 0 || !team || !member || member.length === 0
                                            ? "cursor-not-allowed bg-gray-700/60 text-gray-400"
                                            : "bg-[#EAE0CF] text-[#111844] hover:bg-white"
                                            }`}
                                    >
                                        {!isProfileComplete
                                            ? "Complete profile first"
                                            : !team
                                                ? "Please create team first"
                                                : !member || member.length === 0
                                                    ? "Please add member first"
                                                    : registrations.length > 0
                                                        ? "Cannot register again"
                                                        : isActive
                                                            ? "Register Now"
                                                            : "Registration Closed"}

                                        {isActive && team && member && member.length > 0 && registrations.length === 0 && isProfileComplete && (
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

                            <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                                <div className="flex items-center gap-2">
                                    <BadgeDollarSign className="h-5 w-5 text-yellow-400" />

                                    <p className="text-sm font-medium text-yellow-300">
                                        Registration fee depends on the registration period.
                                        Please transfer according to the current registration schedule.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-[#EAE0CF]" />
                                    <h3 className="font-semibold text-white">
                                        Payment Detail
                                    </h3>
                                </div>

                                <div className="mt-3 space-y-3">
                                    {getPaymentDetail(selectedCompetition.name_competition)
                                        .periods.map((payment, index) => (
                                            <div
                                                key={index}
                                                className="rounded-xl bg-white/5 p-3"
                                            >
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-blue-400" />

                                                        <p className="text-sm font-medium text-white">
                                                            {payment.label}
                                                        </p>
                                                    </div>

                                                    <p className="text-sm font-semibold text-[#EAE0CF]">
                                                        {payment.price}
                                                    </p>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {payment.date}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] p-4">
                                <div className="flex items-center gap-2">
                                    <BadgeDollarSign className="h-5 w-5 text-[#EAE0CF]" />

                                    <h3 className="font-semibold text-white">
                                        Discount Code
                                    </h3>
                                </div>

                                <p className="mt-1 text-xs text-gray-400">
                                    Enter your discount code to get a
                                    registration discount.
                                </p>

                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={discountCode}
                                        disabled={Boolean(redeemedDiscount)}
                                        onChange={(e) =>
                                            setDiscountCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="Enter discount code"
                                        className="min-w-0 flex-1 rounded-xl border border-[#7288AE]/30 bg-[#111844] px-4 py-3 text-sm uppercase text-white outline-none placeholder:normal-case placeholder:text-gray-500 focus:border-[#EAE0CF] disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRedeemDiscountCode}
                                        disabled={
                                            redeemLoading ||
                                            Boolean(redeemedDiscount) ||
                                            !discountCode.trim()
                                        }
                                        className="cursor-pointer rounded-xl bg-[#EAE0CF] px-5 py-3 text-sm font-semibold text-[#111844] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {redeemLoading
                                            ? "Applying..."
                                            : redeemedDiscount
                                                ? "Applied"
                                                : "Apply Code"}
                                    </button>
                                </div>

                                {registrationAmount !== null && (
                                    <div className="mt-4 space-y-2 rounded-xl bg-white/5 p-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">
                                                Registration Fee
                                            </span>

                                            <span
                                                className={
                                                    redeemedDiscount
                                                        ? "text-gray-500 line-through"
                                                        : "font-medium text-white"
                                                }
                                            >
                                                {formatRupiah(
                                                    registrationAmount
                                                )}
                                            </span>
                                        </div>

                                        {redeemedDiscount && (
                                            <>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-green-300">
                                                        Discount (
                                                        {
                                                            redeemedDiscount.discount_code
                                                        }
                                                        )
                                                    </span>

                                                    <span className="font-medium text-green-300">
                                                        -
                                                        {formatRupiah(
                                                            redeemedDiscount.discount_amount
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="border-t border-white/10 pt-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-white">
                                                            Total Payment
                                                        </span>

                                                        <span className="text-lg font-bold text-[#EAE0CF]">
                                                            {formatRupiah(
                                                                redeemedDiscount.final_amount
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                                                    <CircleCheck className="h-4 w-4 shrink-0 text-green-400" />

                                                    <p className="text-xs text-green-300">
                                                        Discount code successfully
                                                        applied.
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {!redeemedDiscount && (
                                            <div className="border-t border-white/10 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-white">
                                                        Total Payment
                                                    </span>

                                                    <span className="text-lg font-bold text-[#EAE0CF]">
                                                        {formatRupiah(
                                                            finalRegistrationAmount ??
                                                            0
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] p-4">
                                <h3 className="text-sm font-semibold text-white">
                                    Payment Method
                                </h3>

                                <div className="mt-3 space-y-3 text-sm text-gray-300">

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Landmark className="h-5 w-5 text-[#60A5FA]" />

                                            <p className="font-medium text-white">
                                                Bank Transfer
                                            </p>
                                        </div>

                                        <p>
                                            0079 6934 9574
                                        </p>

                                        <p>
                                            BLU by BCA (BCA Digital)
                                        </p>

                                        <p>
                                            Migalif Yuari Chikyu
                                        </p>
                                    </div>


                                    <div className="border-t border-white/10 pt-3">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="h-5 w-5 text-[#FBBF24]" />

                                            <p className="font-medium text-white">
                                                PayPal
                                            </p>
                                        </div>

                                        <p>
                                            paypal.me/faiqradhitya
                                        </p>
                                    </div>

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