import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Trophy,
    Clock,
    ExternalLink,
    RefreshCcw,
    FileText,
    CalendarDays,
    UploadCloud,
    Loader2,
} from "lucide-react"
import { isTokenExpired } from "../../utils/auth"
import Toast from "../Toast"

interface User {
    id_team_leader?: string | number
    name_team_leader?: string
    email_team_leader?: string
}

interface Team {
    id_team?: number
    id?: number
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

interface Stage {
    _id: string
    id_competition: number
    stage_name?: string
    description_stage?: string
    start_stage: string
    end_stage: string
    passed_teams: number[]
    status_stage: string
    createdAt: string
    updatedAt: string
}

interface StageSubmission {
    _id?: string
    id?: string
    id_stage: string
    id_team: number
    submission_title: string
    submission_link: string
    submission_note?: string
    submission_status: string
    createdAt?: string
    updatedAt?: string
}

const MyCompetition = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)
    const [team, setTeam] = useState<Team | null>(null)
    const [registration, setRegistration] = useState<Registration | null>(null)
    const [stages, setStages] = useState<Stage[]>([])
    const [submissions, setSubmissions] = useState<StageSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [now, setNow] = useState(new Date())

    const [uploadingStageId, setUploadingStageId] = useState<string | null>(null)
    const [submissionTitles, setSubmissionTitles] = useState<Record<string, string>>({})
    const [submissionFiles, setSubmissionFiles] = useState<Record<string, File | null>>({})

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const closeToast = useCallback(() => {
        setToast(null)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

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
        const teamData = localStorage.getItem("team")

        if (userData) setUser(JSON.parse(userData))
        if (teamData) setTeam(JSON.parse(teamData))
    }, [])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getCountdown = (targetDate: string) => {
        const target = new Date(targetDate).getTime()
        const diff = target - now.getTime()

        if (diff <= 0) return "Time has ended"

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)

        return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }

    const getStageStatus = (stage: Stage) => {
        const start = new Date(stage.start_stage).getTime()
        const end = new Date(stage.end_stage).getTime()
        const current = now.getTime()

        if (current < start) return "UPCOMING"
        if (current >= start && current <= end) return "ONGOING"
        return "ENDED"
    }

    const getBadgeClass = (status: string) => {
        if (
            status === "ACTIVE" ||
            status === "ONGOING" ||
            status === "SUBMITTED" ||
            status === "PASSED" ||
            status === "APPROVED"
        ) {
            return "border-green-500/30 bg-green-500/15 text-green-300"
        }

        if (status === "PENDING" || status === "UPCOMING") {
            return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300"
        }

        if (
            status === "REJECTED" ||
            status === "FAILED" ||
            status === "ENDED" ||
            status === "NOT PASSED"
        ) {
            return "border-red-500/30 bg-red-500/15 text-red-300"
        }

        if (status === "CHECKING") {
            return "border-blue-500/30 bg-blue-500/15 text-blue-300"
        }

        return "border-gray-500/30 bg-gray-500/15 text-gray-300"
    }

    const getCurrentTeamId = () => {
        const localTeamData = localStorage.getItem("team")
        const parsedTeam = localTeamData ? JSON.parse(localTeamData) : null

        return (
            team?.id_team ||
            team?.id ||
            parsedTeam?.id_team ||
            parsedTeam?.id ||
            Number(localStorage.getItem("id_team")) ||
            registration?.id_team_leader ||
            null
        )
    }

    const getMyCompetition = async (idTeamLeader: string | number) => {
        const token = sessionStorage.getItem("token")

        try {
            setLoading(true)

            const registrationResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getRegistrationByIdTeamLeader/${idTeamLeader}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (registrationResponse.status === 202 || registrationResponse.status === 404) {
                setRegistration(null)
                setStages([])
                setSubmissions([])
                return
            }

            const registrationData = await registrationResponse.json()
            const selectedRegistration = registrationData.registration?.[0] || null

            if (!selectedRegistration) {
                setRegistration(null)
                setStages([])
                setSubmissions([])
                return
            }

            setRegistration(selectedRegistration)

            const stagesResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStagesByIdCompetition/${selectedRegistration.id_competition}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const stagesData = await stagesResponse.json()
            const fetchedStages = stagesData.data || stagesData.stages || []
            setStages(fetchedStages)

            const currentTeamData = localStorage.getItem("team")
            const parsedTeam = currentTeamData ? JSON.parse(currentTeamData) : null

            const idTeam =
                parsedTeam?.id_team ||
                parsedTeam?.id ||
                selectedRegistration.id_team_leader

            const submissionsResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStageSubmissionsByIdTeam/${idTeam}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const submissionsData = await submissionsResponse.json()
            setSubmissions(submissionsData.data || [])
        } catch (error) {
            console.error("Failed to fetch competition detail:", error)
            setRegistration(null)
            setStages([])
            setSubmissions([])
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
    }, [])

    const sortedStages = useMemo(() => {
        return [...stages].sort(
            (a, b) =>
                new Date(a.start_stage).getTime() -
                new Date(b.start_stage).getTime()
        )
    }, [stages])

    const getSubmissionByStage = (stageId: string) => {
        return submissions.find((submission) => submission.id_stage === stageId)
    }

    const getStageQualification = (stageIndex: number) => {
        const idTeam = getCurrentTeamId()

        if (!idTeam) {
            return {
                isQualified: false,
                status: "NOT PASSED",
                note: "Team ID not found. Please refresh or contact the committee.",
            }
        }

        const currentStage = sortedStages[stageIndex]
        const currentStageStatus = getStageStatus(currentStage)
        const currentSubmission = getSubmissionByStage(currentStage._id)

        const teamId = Number(idTeam)

        // cek semua stage sebelumnya
        for (let i = 0; i < stageIndex; i++) {
            const previousStage = sortedStages[i]
            const previousStageStatus = getStageStatus(previousStage)
            const previousSubmission = getSubmissionByStage(previousStage._id)
            const previousPassedTeams = previousStage.passed_teams || []
            const isPassedPreviousStage = previousPassedTeams.includes(teamId)

            if (previousStageStatus === "ENDED" && !isPassedPreviousStage) {
                return {
                    isQualified: false,
                    status: "NOT PASSED",
                    note: `Your team did not pass ${previousStage.stage_name || `Stage ${i + 1}`}, so you cannot submit to ${currentStage.stage_name || "this stage"}.`,
                }
            }

            if (!previousSubmission && previousStageStatus === "ENDED") {
                return {
                    isQualified: false,
                    status: "NOT PASSED",
                    note: `You did not submit for ${previousStage.stage_name || `Stage ${i + 1}`}, so you cannot continue to ${currentStage.stage_name || "this stage"}.`,
                }
            }
        }

        const passedTeams = currentStage?.passed_teams || []
        const isPassed = passedTeams.includes(teamId)

        if (isPassed) {
            return {
                isQualified: true,
                status: "PASSED",
                note: `Congratulations! Your team passed ${currentStage.stage_name || "this stage"}.`,
            }
        }

        if (currentSubmission && currentStageStatus !== "ENDED") {
            return {
                isQualified: true,
                status: "CHECKING",
                note: `Your submission for ${currentStage.stage_name || "this stage"} is being checked by the committee.`,
            }
        }

        if (currentSubmission && currentStageStatus === "ENDED") {
            return {
                isQualified: false,
                status: "NOT PASSED",
                note: `Your team did not pass ${currentStage.stage_name || "this stage"}.`,
            }
        }

        if (!currentSubmission && currentStageStatus === "ENDED") {
            return {
                isQualified: false,
                status: "NOT PASSED",
                note: `You did not submit for ${currentStage.stage_name || "this stage"}, so your team did not pass this stage.`,
            }
        }

        return {
            isQualified: true,
            status: "ONGOING",
            note: `You are eligible to submit for ${currentStage.stage_name || "this stage"}.`,
        }
    }

    const handleUploadSubmission = async (stageId: string) => {
        const token = sessionStorage.getItem("token")
        const existingSubmission = getSubmissionByStage(stageId)

        const title =
            submissionTitles[stageId] ||
            existingSubmission?.submission_title ||
            ""

        const file = submissionFiles[stageId]
        const idTeam = getCurrentTeamId()

        if (!idTeam) {
            setToast({ message: "Team ID not found.", type: "error" })
            return
        }

        const selectedStage = sortedStages.find((stage) => stage._id === stageId)
        const stageIndex = sortedStages.findIndex((stage) => stage._id === stageId)

        if (!selectedStage || stageIndex === -1) {
            setToast({ message: "Stage not found.", type: "error" })
            return
        }

        const realStatus = getStageStatus(selectedStage)
        const qualification = getStageQualification(stageIndex)

        if (realStatus !== "ONGOING") {
            setToast({ message: "Timeline stage sudah habis. Submission tidak bisa diupload atau diedit kembali.", type: "error" })
            return
        }

        if (!qualification.isQualified) {
            setToast({ message: qualification.note, type: "error" })
            return
        }

        if (!title) {
            setToast({ message: "Please fill submission title.", type: "error" })
            return
        }

        if (!existingSubmission && !file) {
            setToast({ message: "Please upload submission file.", type: "error" })
            return
        }

        const formData = new FormData()
        formData.append("id_stage", stageId)
        formData.append("id_team", String(idTeam))
        formData.append("submission_title", title)

        if (file) {
            formData.append("submission_link", file)
        }

        try {
            setUploadingStageId(stageId)

            const isUpdate = Boolean(existingSubmission?._id || existingSubmission?.id)
            const submissionId = existingSubmission?._id || existingSubmission?.id

            const response = await fetch(
                isUpdate
                    ? `${import.meta.env.VITE_API_BASE_URL}/updateStageSubmission/${submissionId}`
                    : `${import.meta.env.VITE_API_BASE_URL}/createStageSubmission`,
                {
                    method: isUpdate ? "PUT" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setToast({ message: data.message || "Failed to save submission.", type: "error" })
                return
            }

            setToast({ message: isUpdate ? "Submission updated successfully." : "Submission uploaded successfully.", type: "success" })

            setSubmissionTitles((prev) => ({
                ...prev,
                [stageId]: "",
            }))

            setSubmissionFiles((prev) => ({
                ...prev,
                [stageId]: null,
            }))

            if (user?.id_team_leader) {
                await getMyCompetition(user.id_team_leader)
            }
        } catch (error) {
            console.error("Failed to save submission:", error)
            setToast({ message: "Failed to save submission.", type: "error" })
        } finally {
            setUploadingStageId(null)
        }
    }

    // If payment is pending, show pending payment message instead of competition details
    if (registration?.payment_status === "PENDING") {
        return (
            <div className="min-h-screen px-10 py-7 text-white">
                <div className="flex flex-col gap-8">
                    <div>
                        <p className="font-garamond text-4xl font-semibold text-white underline">
                            My Competition
                        </p>

                        <p className="mt-2 text-sm text-gray-400">

                            Track your registration, competition stages, deadline, and submission status.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            user?.id_team_leader && getMyCompetition(user.id_team_leader)
                        }
                        className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl border border-[#7288AE]/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                <div className="mt-10 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#7288AE]/40 bg-[#111844]/40 text-center">
                    <Trophy className="mb-4 h-14 w-14 text-gray-500" />
                    <h2 className="text-xl font-semibold text-white">
                        Payment Pending
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-gray-400">
                        Your registration is pending payment. Please wait for the payment to be processed to access the competition details and stages.
                    </p>
                    <a
                        href={registration.payment_proof}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-6 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
                    >View Payment Proof</a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen px-10 py-7 text-white">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-garamond text-4xl font-semibold text-white underline">
                            My Competition
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            Track your registration, competition stages, deadline, and submission status.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            user?.id_team_leader && getMyCompetition(user.id_team_leader)
                        }
                        className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl border border-[#7288AE]/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="h-96 animate-pulse rounded-3xl border border-[#7288AE]/20 bg-[#111844]/60" />
                ) : !registration ? (
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#7288AE]/40 bg-[#111844]/40 text-center">
                        <Trophy className="mb-4 h-14 w-14 text-gray-500" />

                        <h2 className="text-xl font-semibold text-white">
                            No competition registration found
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-gray-400">
                            You have not registered for any competition yet.
                        </p>

                        <button
                            onClick={() => navigate("/competitions")}
                            className="mt-6 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
                        >
                            Browse Competitions
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <section className="rounded-3xl border border-[#7288AE]/25 bg-[#111844]/80 p-7">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAE0CF] text-[#111844]">
                                            <Trophy className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-semibold">
                                                Competition #{registration.id_competition}
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                Registration ID #{registration.id_registration}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="max-w-3xl text-sm leading-7 text-gray-300">
                                        You are registered in the{" "}
                                        <span className="font-semibold text-[#EAE0CF]">
                                            {registration.category_registration}
                                        </span>{" "}
                                        category. Below are the active stages, timeline, qualification notes, and your submission progress.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getBadgeClass(
                                            registration.status_registration
                                        )}`}
                                    >
                                        {registration.status_registration}
                                    </span>

                                    <span
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getBadgeClass(
                                            registration.payment_status
                                        )}`}
                                    >
                                        Payment {registration.payment_status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href={registration.payment_proof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#EAE0CF] px-5 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
                                >
                                    View Payment Proof
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-[#7288AE]/25 bg-[#111844]/70 p-7">
                            <div className="mb-6 flex items-center gap-3">
                                <CalendarDays className="h-6 w-6 text-[#EAE0CF]" />
                                <h2 className="text-2xl font-semibold">
                                    Competition Stages
                                </h2>
                            </div>

                            {sortedStages.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    No stages available for this competition yet.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {sortedStages.map((stage, index) => {
                                        const realStatus = getStageStatus(stage)

                                        const countdown =
                                            realStatus === "UPCOMING"
                                                ? getCountdown(stage.start_stage)
                                                : getCountdown(stage.end_stage)

                                        const submission = getSubmissionByStage(stage._id)
                                        const isUploading = uploadingStageId === stage._id

                                        const qualification = getStageQualification(index)

                                        const canUpload =
                                            realStatus === "ONGOING" && qualification.isQualified

                                        return (
                                            <div
                                                key={stage._id}
                                                className="border-b border-[#7288AE]/20 pb-6 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4B5694]/40 text-sm font-bold text-[#EAE0CF]">
                                                            {index + 1}
                                                        </div>

                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <h3 className="text-xl font-semibold text-white">
                                                                    {stage.stage_name || `Stage ${index + 1}`}
                                                                </h3>

                                                                <span
                                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(
                                                                        realStatus
                                                                    )}`}
                                                                >
                                                                    {realStatus}
                                                                </span>

                                                                <span
                                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(
                                                                        qualification.status
                                                                    )}`}
                                                                >
                                                                    {qualification.status}
                                                                </span>
                                                            </div>

                                                            <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-300">
                                                                {stage.description_stage ||
                                                                    "No description available for this stage."}
                                                            </p>

                                                            <div
                                                                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${qualification.isQualified
                                                                    ? "border-green-500/30 bg-green-500/10 text-green-300"
                                                                    : "border-red-500/30 bg-red-500/10 text-red-300"
                                                                    }`}
                                                            >
                                                                {qualification.note}
                                                            </div>

                                                            <div className="mt-4 grid gap-3 text-sm text-gray-300 md:grid-cols-2">
                                                                <div className="rounded-2xl bg-[#4B5694]/20 p-4">
                                                                    <p className="text-xs text-gray-400">
                                                                        Start Stage
                                                                    </p>
                                                                    <p className="mt-1 font-semibold">
                                                                        {formatDate(stage.start_stage)}
                                                                    </p>
                                                                </div>

                                                                <div className="rounded-2xl bg-[#4B5694]/20 p-4">
                                                                    <p className="text-xs text-gray-400">
                                                                        End Stage
                                                                    </p>
                                                                    <p className="mt-1 font-semibold">
                                                                        {formatDate(stage.end_stage)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="min-w-64 rounded-3xl border border-[#7288AE]/25 bg-[#0B102F]/80 p-5">
                                                        <div className="mb-2 flex items-center gap-2 text-[#EAE0CF]">
                                                            <Clock className="h-5 w-5" />
                                                            <p className="text-sm font-semibold">
                                                                {realStatus === "UPCOMING"
                                                                    ? "Starts In"
                                                                    : realStatus === "ONGOING"
                                                                        ? "Deadline In"
                                                                        : "Stage Ended"}
                                                            </p>
                                                        </div>

                                                        <p className="text-2xl font-bold text-white">
                                                            {countdown}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-5 rounded-3xl border border-[#7288AE]/20 bg-[#0B102F]/50 p-5">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <UploadCloud className="h-5 w-5 text-[#EAE0CF]" />
                                                        <h4 className="font-semibold text-white">
                                                            Submission
                                                        </h4>
                                                    </div>

                                                    {submission && (
                                                        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#7288AE]/20 bg-[#111844]/60 p-4 md:flex-row md:items-center md:justify-between">
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-3">
                                                                    <p className="font-semibold text-white">
                                                                        {submission.submission_title}
                                                                    </p>

                                                                    <span
                                                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(
                                                                            submission.submission_status
                                                                        )}`}
                                                                    >
                                                                        {submission.submission_status}
                                                                    </span>
                                                                </div>

                                                                <p className="mt-2 text-sm text-gray-400">
                                                                    {submission.submission_note ||
                                                                        "No submission note provided."}
                                                                </p>
                                                            </div>

                                                            <a
                                                                href={submission.submission_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EAE0CF] px-5 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
                                                            >
                                                                View Submission
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col gap-4">
                                                        {!submission && (
                                                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                                                <FileText className="h-5 w-5" />
                                                                No submission uploaded for this stage yet.
                                                            </div>
                                                        )}

                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div>
                                                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                    Submission Title
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        submissionTitles[stage._id] ??
                                                                        submission?.submission_title ??
                                                                        ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        setSubmissionTitles((prev) => ({
                                                                            ...prev,
                                                                            [stage._id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    placeholder="Example: Final PDF Team 8"
                                                                    disabled={!canUpload || isUploading}
                                                                    className="w-full rounded-2xl border border-[#7288AE]/30 bg-[#111844] px-4 py-5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#EAE0CF] disabled:cursor-not-allowed disabled:opacity-50"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                    {submission
                                                                        ? "Replace Submission File"
                                                                        : "Submission File"}
                                                                </label>

                                                                <input
                                                                    type="file"
                                                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                                                                    disabled={!canUpload || isUploading}
                                                                    onChange={(e) =>
                                                                        setSubmissionFiles((prev) => ({
                                                                            ...prev,
                                                                            [stage._id]: e.target.files?.[0] || null,
                                                                        }))
                                                                    }
                                                                    className="cursor-pointer w-full rounded-2xl border border-[#7288AE]/30 bg-[#111844] px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-[#EAE0CF] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#111844] disabled:cursor-not-allowed disabled:opacity-50"
                                                                />
                                                            </div>
                                                        </div>

                                                        {!qualification.isQualified && (
                                                            <p className="text-sm text-red-300">
                                                                {qualification.note}
                                                            </p>
                                                        )}

                                                        {qualification.isQualified && realStatus === "UPCOMING" && (
                                                            <p className="text-sm text-yellow-300">
                                                                Submission belum dibuka. Kamu bisa upload saat stage sudah dimulai.
                                                            </p>
                                                        )}

                                                        {qualification.isQualified && realStatus === "ENDED" && (
                                                            <p className="text-sm text-red-300">
                                                                Timeline stage sudah habis. Submission tidak bisa diupload atau diedit kembali.
                                                            </p>
                                                        )}

                                                        {qualification.isQualified && realStatus === "ONGOING" && submission && (
                                                            <p className="text-sm text-green-300">
                                                                Timeline masih berlangsung. Kamu masih bisa mengedit atau upload ulang submission.
                                                            </p>
                                                        )}

                                                        {qualification.isQualified && realStatus === "ONGOING" && !submission && (
                                                            <p className="text-sm text-green-300">
                                                                Timeline sedang berlangsung. Kamu bisa upload submission untuk stage ini.
                                                            </p>
                                                        )}

                                                        <button
                                                            type="button"
                                                            disabled={!canUpload || isUploading}
                                                            onClick={() => handleUploadSubmission(stage._id)}
                                                            className="cursor-pointer inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {isUploading ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                    Saving...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UploadCloud className="h-4 w-4" />
                                                                    {submission
                                                                        ? "Update Submission"
                                                                        : "Upload Submission"}
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
        </div>
    )
}

export default MyCompetition