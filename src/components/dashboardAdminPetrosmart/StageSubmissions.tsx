import { useEffect, useMemo, useState } from "react"
import {
    Eye,
    FileText,
    Layers3,
    X,
    Trash2,
    Pencil,
    Users,
    Download,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Toast from "../Toast"
import { isTokenExpired } from "../../utils/auth"

interface Competition {
    id_competition: number
    name_competition: string
    status_competition: string
}

interface Stage {
    _id: string
    id_competition: number
    stage_name: string
    start_stage: string
    end_stage: string
    status_stage?: string
}

interface Team {
    id_team: number
    team_name: string
    institution?: string
    id_competition?: number
}

interface StageSubmission {
    _id: string
    id_stage: string
    id_team: number | string
    submission_file?: string
    submission_link?: string
    submission_note?: string
    submission_status?: string
    createdAt?: string
    updatedAt?: string
}

const StageSubmissions = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const [petrosmartCompetition, setPetrosmartCompetition] =
        useState<Competition | null>(null)

    const [stages, setStages] = useState<Stage[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [submissions, setSubmissions] = useState<StageSubmission[]>([])

    const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
    const [selectedSubmission, setSelectedSubmission] =
        useState<StageSubmission | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [form, setForm] = useState({
        submission_status: "PENDING",
        submission_note: "",
    })

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

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

    useEffect(() => {
        fetchPetrosmartCompetition()
        fetchTeams()
    }, [])

    const fetchPetrosmartCompetition = async () => {
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
            const competitions: Competition[] =
                data.competitions || data.data || data || []

            const petrosmart = competitions.find((competition) =>
                competition.name_competition
                    ?.toLowerCase()
                    .includes("petrosmart")
            )

            if (!petrosmart) {
                setToast({
                    message: "Petrosmart competition not found.",
                    type: "error",
                })
                return
            }

            setPetrosmartCompetition(petrosmart)
            fetchStagesByCompetition(petrosmart.id_competition)
        } catch (error) {
            console.error(error)
            setToast({
                message: "Failed to fetch Petrosmart competition.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTeams = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllTeams`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()
            setTeams(data.teams || data.data || data || [])
        } catch (error) {
            console.error(error)
        }
    }

    const fetchStagesByCompetition = async (id_competition: number) => {
        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStagesByIdCompetition/${id_competition}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()
            const stageData: Stage[] = data.stages || data.data || data || []

            setStages(stageData)

            if (stageData.length > 0) {
                setSelectedStage(stageData[0])
                fetchSubmissionsByStage(stageData[0]._id)
            } else {
                setSubmissions([])
            }
        } catch (error) {
            console.error(error)
            setStages([])
            setSubmissions([])
            setToast({
                message: "Failed to fetch stages.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSubmissionsByStage = async (id_stage: string) => {
        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStageSubmissionsByIdStage/${id_stage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()
            setSubmissions(data.submissions || data.data || data || [])
        } catch (error) {
            console.error(error)
            setSubmissions([])
            setToast({
                message: "Failed to fetch stage submissions.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const openSubmissionList = async (stage: Stage) => {
        setSelectedStage(stage)
        await fetchSubmissionsByStage(stage._id)
    }

    const getTeamName = (id_team: number | string) => {
        const team = teams.find(
            (item) => Number(item.id_team) === Number(id_team)
        )

        return team?.team_name || `Team ${id_team}`
    }

    const getTeamInstitution = (id_team: number | string) => {
        const team = teams.find(
            (item) => Number(item.id_team) === Number(id_team)
        )

        return team?.institution || "-"
    }

    const getDownloadFileName = (submission: StageSubmission) => {
        const teamName = getTeamName(submission.id_team)
            .replace(/\s+/g, "-")
            .toLowerCase()

        const stageName = selectedStage?.stage_name
            ?.replace(/\s+/g, "-")
            .toLowerCase()

        return `${teamName}-${stageName || "submission"}.pdf`
    }

    const openDetailModal = (submission: StageSubmission) => {
        setSelectedSubmission(submission)
        setIsSubmissionModalOpen(true)
    }

    const openEditModal = (submission: StageSubmission) => {
        setSelectedSubmission(submission)
        setForm({
            submission_status: submission.submission_status || "PENDING",
            submission_note: submission.submission_note || "",
        })
        setIsEditModalOpen(true)
    }

    const handleUpdateSubmission = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedSubmission || !selectedStage) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateStageSubmission/${selectedSubmission._id}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        submission_status: form.submission_status,
                        submission_note: form.submission_note,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to update submission.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Submission updated successfully.",
                type: "success",
            })

            setIsEditModalOpen(false)
            setSelectedSubmission(null)

            fetchSubmissionsByStage(selectedStage._id)
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

    const handleDeleteSubmission = async () => {
        if (!selectedSubmission || !selectedStage) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/deleteStageSubmission/${selectedSubmission._id}`,
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
                    message: data.error || "Failed to delete submission.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Submission deleted successfully.",
                type: "success",
            })

            setIsDeleteModalOpen(false)
            setSelectedSubmission(null)

            fetchSubmissionsByStage(selectedStage._id)
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

    const reviewedSubmissions = useMemo(() => {
        return submissions.filter(
            (submission) => submission.submission_status === "REVIEWED"
        ).length
    }, [submissions])

    const pendingSubmissions = useMemo(() => {
        return submissions.filter(
            (submission) =>
                !submission.submission_status ||
                submission.submission_status === "PENDING"
        ).length
    }, [submissions])

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Petrosmart Stage Submissions
                </p>
                <p className="text-sm opacity-70 mt-1">
                    View and manage team submissions for each Petrosmart stage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <Layers3 className="mb-3" />
                    <p className="text-sm opacity-70">Total Stages</p>
                    <p className="text-3xl font-bold mt-1">{stages.length}</p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <FileText className="mb-3" />
                    <p className="text-sm opacity-70">Current Submissions</p>
                    <p className="text-3xl font-bold mt-1">
                        {submissions.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">Pending</p>
                    <p className="text-3xl font-bold mt-1">
                        {pendingSubmissions}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Eye className="mb-3" />
                    <p className="text-sm opacity-70">Reviewed</p>
                    <p className="text-3xl font-bold mt-1">
                        {reviewedSubmissions}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="mb-5">
                    <p className="font-semibold text-lg">
                        {petrosmartCompetition?.name_competition ||
                            "Petrosmart Competition"}
                    </p>
                    <p className="text-sm opacity-70">
                        Select a stage to view all team submissions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="glass p-5 rounded-2xl lg:col-span-1">
                        <p className="font-semibold text-lg mb-4">Stages</p>

                        <div className="space-y-3">
                            {stages.map((stage) => (
                                <button
                                    key={stage._id}
                                    onClick={() => openSubmissionList(stage)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${selectedStage?._id === stage._id
                                            ? "bg-cyan-500/10 border-cyan-400/40"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    <p className="font-medium">
                                        {stage.stage_name}
                                    </p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {stage.status_stage || "-"}
                                    </p>
                                    <p className="text-xs opacity-50 mt-1">
                                        {stage.start_stage
                                            ? new Date(
                                                stage.start_stage
                                            ).toLocaleDateString()
                                            : "-"}{" "}
                                        -{" "}
                                        {stage.end_stage
                                            ? new Date(
                                                stage.end_stage
                                            ).toLocaleDateString()
                                            : "-"}
                                    </p>
                                </button>
                            ))}

                            {!isLoading && stages.length === 0 && (
                                <p className="text-sm opacity-70">
                                    No stage data found.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="glass p-5 rounded-2xl lg:col-span-2">
                        <div className="mb-5">
                            <p className="font-semibold text-lg">
                                Submission List
                            </p>
                            <p className="text-sm opacity-70 mt-1">
                                {selectedStage
                                    ? `Stage: ${selectedStage.stage_name}`
                                    : "Please select a stage first."}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left py-3 px-3">
                                            No
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Team
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Institution
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            File
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {submissions.map((submission, index) => (
                                        <tr
                                            key={submission._id}
                                            className="border-b border-white/10"
                                        >
                                            <td className="py-3 px-3">
                                                {index + 1}
                                            </td>

                                            <td className="py-3 px-3 font-medium">
                                                {getTeamName(
                                                    submission.id_team
                                                )}
                                            </td>

                                            <td className="py-3 px-3">
                                                {getTeamInstitution(
                                                    submission.id_team
                                                )}
                                            </td>

                                            <td className="py-3 px-3">
                                                <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300">
                                                    {submission.submission_status ||
                                                        "PENDING"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-3">
                                                {submission.submission_link ||
                                                    submission.submission_file ? (
                                                    <a
                                                        href={
                                                            submission.submission_link ||
                                                            submission.submission_file
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        download={getDownloadFileName(
                                                            submission
                                                        )}
                                                        className="inline-flex items-center gap-2 text-cyan-300 underline"
                                                    >
                                                        <Download size={15} />
                                                        Download
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>

                                            <td className="py-3 px-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openDetailModal(
                                                                submission
                                                            )
                                                        }
                                                        className="glass p-2 rounded-lg cursor-pointer"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                submission
                                                            )
                                                        }
                                                        className="glass p-2 rounded-lg cursor-pointer"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedSubmission(
                                                                submission
                                                            )
                                                            setIsDeleteModalOpen(
                                                                true
                                                            )
                                                        }}
                                                        className="glass p-2 rounded-lg cursor-pointer text-red-300"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {selectedStage && submissions.length === 0 && (
                                <p className="text-center text-sm opacity-70 py-6">
                                    No submission found for this stage.
                                </p>
                            )}

                            {isLoading && (
                                <p className="text-center text-sm opacity-70 py-6">
                                    Loading data...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isSubmissionModalOpen && selectedSubmission && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-3xl">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                Submission Detail
                            </p>

                            <button
                                onClick={() =>
                                    setIsSubmissionModalOpen(false)
                                }
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoBox
                                label="Team"
                                value={getTeamName(selectedSubmission.id_team)}
                            />

                            <InfoBox
                                label="Institution"
                                value={getTeamInstitution(
                                    selectedSubmission.id_team
                                )}
                            />

                            <InfoBox
                                label="Status"
                                value={
                                    selectedSubmission.submission_status ||
                                    "PENDING"
                                }
                            />

                            <InfoBox
                                label="Note"
                                value={selectedSubmission.submission_note || "-"}
                            />

                            <InfoBox
                                label="Created At"
                                value={
                                    selectedSubmission.createdAt
                                        ? new Date(
                                            selectedSubmission.createdAt
                                        ).toLocaleString()
                                        : "-"
                                }
                            />

                            <InfoBox
                                label="Updated At"
                                value={
                                    selectedSubmission.updatedAt
                                        ? new Date(
                                            selectedSubmission.updatedAt
                                        ).toLocaleString()
                                        : "-"
                                }
                            />
                        </div>

                        <div className="mt-5">
                            <FileBox
                                label="Submission File"
                                value={
                                    selectedSubmission.submission_link ||
                                    selectedSubmission.submission_file
                                }
                                fileName={getDownloadFileName(
                                    selectedSubmission
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedSubmission && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                Update Submission
                            </p>

                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmission}>
                            <div>
                                <p>Status Submission</p>
                                <select
                                    value={form.submission_status}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            submission_status: e.target.value,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="REVIEWED">REVIEWED</option>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <p>Submission Note</p>
                                <textarea
                                    value={form.submission_note}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            submission_note: e.target.value,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black min-h-28"
                                    placeholder="Enter note..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full glass px-5 py-3 text-center mt-6 rounded-xl ${isLoading
                                        ? "opacity-60 cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                            >
                                {isLoading ? "Saving..." : "Update Submission"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && selectedSubmission && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 size={30} className="text-red-400" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-center mt-4">
                            Delete Submission
                        </h2>

                        <p className="text-center text-white/70 mt-2">
                            Are you sure you want to delete this submission?
                        </p>

                        <p className="text-center text-sm text-red-300 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setSelectedSubmission(null)
                                }}
                                className="cursor-pointer flex-1 glass py-3 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteSubmission}
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

const FileBox = ({
    label,
    value,
    fileName,
}: {
    label: string
    value?: string
    fileName?: string
}) => {
    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-medium">{label}</p>

            {value ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    download={fileName || "submission.pdf"}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300"
                >
                    <Download size={16} />
                    Download File
                </a>
            ) : (
                <p className="text-sm text-gray-500 mt-3">
                    No file uploaded.
                </p>
            )}
        </div>
    )
}

export default StageSubmissions