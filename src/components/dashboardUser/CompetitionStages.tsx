import { useEffect, useMemo, useState } from "react"
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Layers3,
    Users,
    CheckCircle,
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
    passed_teams?: string[]
}

interface Team {
    id_team: number
    team_name: string
    institution?: string
    id_team_leader?: number
}

const CompetitionStages = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [selectedCompetition, setSelectedCompetition] =
        useState<Competition | null>(null)

    const [stages, setStages] = useState<Stage[]>([])
    const [teams, setTeams] = useState<Team[]>([])

    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [isStageModalOpen, setIsStageModalOpen] = useState(false)
    const [isStageFormModalOpen, setIsStageFormModalOpen] = useState(false)
    const [isPassedTeamModalOpen, setIsPassedTeamModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [editingStage, setEditingStage] = useState<Stage | null>(null)
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null)

    const [passedTeams, setPassedTeams] = useState<string[]>([])

    const [stageForm, setStageForm] = useState({
        stage_name: "",
        start_stage: "",
        end_stage: "",
        status_stage: "UPCOMING",
    })

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }

    const getUniquePassedTeams = (teamIds?: string[]) => {
        return Array.from(new Set((teamIds || []).map(String)))
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
        fetchCompetitions()
        fetchTeams()
    }, [])

    const formatDateTimeLocal = (date?: string) => {
        if (!date) return ""

        const parsedDate = new Date(date)
        const offset = parsedDate.getTimezoneOffset()
        const localDate = new Date(parsedDate.getTime() - offset * 60000)

        return localDate.toISOString().slice(0, 16)
    }

    const toISOStringWithTimezone = (value: string) => {
        if (!value) return ""

        const date = new Date(value)
        return date.toISOString()
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
            setToast({
                message: "Failed to fetch competitions.",
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
            setTeams(data.teams || data.data || data)
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
            setStages(data.stages || data.data || data)
        } catch (error) {
            console.error(error)
            setStages([])
            setToast({
                message: "Failed to fetch stages.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const openStageModal = async (competition: Competition) => {
        setSelectedCompetition(competition)
        setIsStageModalOpen(true)
        await fetchStagesByCompetition(competition.id_competition)
    }

    const openCreateStageModal = () => {
        setEditingStage(null)
        setStageForm({
            stage_name: "",
            start_stage: "",
            end_stage: "",
            status_stage: "UPCOMING",
        })
        setIsStageFormModalOpen(true)
    }

    const openEditStageModal = (stage: Stage) => {
        setEditingStage(stage)
        setStageForm({
            stage_name: stage.stage_name || "",
            start_stage: formatDateTimeLocal(stage.start_stage),
            end_stage: formatDateTimeLocal(stage.end_stage),
            status_stage: stage.status_stage || "UPCOMING",
        })
        setIsStageFormModalOpen(true)
    }

    const handleStageChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setStageForm({
            ...stageForm,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmitStage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedCompetition) return

        try {
            setIsLoading(true)

            const url = editingStage
                ? `${import.meta.env.VITE_API_BASE_URL}/updateStage/${editingStage._id}`
                : `${import.meta.env.VITE_API_BASE_URL}/createStage`

            const method = editingStage ? "PUT" : "POST"

            const body = editingStage
                ? {
                    stage_name: stageForm.stage_name,
                    start_stage: toISOStringWithTimezone(stageForm.start_stage),
                    end_stage: toISOStringWithTimezone(stageForm.end_stage),
                    status_stage: stageForm.status_stage,
                }
                : {
                    id_competition: selectedCompetition.id_competition,
                    stage_name: stageForm.stage_name,
                    start_stage: toISOStringWithTimezone(stageForm.start_stage),
                    end_stage: toISOStringWithTimezone(stageForm.end_stage),
                }

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to save stage.",
                    type: "error",
                })
                return
            }

            setToast({
                message: editingStage
                    ? "Stage updated successfully."
                    : "Stage created successfully.",
                type: "success",
            })

            setIsStageFormModalOpen(false)
            setEditingStage(null)

            fetchStagesByCompetition(selectedCompetition.id_competition)
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

    const openPassedTeamModal = (stage: Stage) => {
        setSelectedStage(stage)
        setPassedTeams(getUniquePassedTeams(stage.passed_teams))
        setIsPassedTeamModalOpen(true)
    }

    const handleTogglePassedTeam = (id_team: number) => {
        const teamId = String(id_team)

        setPassedTeams((prev) => {
            const uniquePrev = getUniquePassedTeams(prev)

            if (uniquePrev.includes(teamId)) {
                return uniquePrev.filter((id) => id !== teamId)
            }

            return [...uniquePrev, teamId]
        })
    }

    const handleRemovePassedTeam = (id_team: number) => {
        const teamId = String(id_team)

        setPassedTeams((prev) =>
            getUniquePassedTeams(prev).filter((id) => id !== teamId)
        )
    }

    const handleUpdatePassedTeams = async () => {
        if (!selectedStage || !selectedCompetition) return

        try {
            setIsLoading(true)

            const uniquePassedTeams = getUniquePassedTeams(passedTeams)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateStage/${selectedStage._id}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        id_competition: selectedStage.id_competition,
                        stage_name: selectedStage.stage_name,
                        start_stage: selectedStage.start_stage,
                        end_stage: selectedStage.end_stage,
                        status_stage: selectedStage.status_stage || "UPCOMING",
                        passed_teams: uniquePassedTeams,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to update passed teams.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Passed teams updated successfully.",
                type: "success",
            })

            setIsPassedTeamModalOpen(false)
            setSelectedStage(null)
            setPassedTeams([])

            fetchStagesByCompetition(selectedCompetition.id_competition)
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

    const openDeleteModal = (stage: Stage) => {
        setSelectedStage(stage)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteStage = async () => {
        if (!selectedStage || !selectedCompetition) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/deleteStage/${selectedStage._id}`,
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
                    message: data.error || "Failed to delete stage.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Stage deleted successfully.",
                type: "success",
            })

            setIsDeleteModalOpen(false)
            setSelectedStage(null)

            fetchStagesByCompetition(selectedCompetition.id_competition)
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

    const filteredCompetitions = useMemo(() => {
        return competitions.filter((competition) =>
            competition.name_competition
                ?.toLowerCase()
                .includes(search.toLowerCase())
        )
    }, [competitions, search])

    const selectedPassedTeamDetails = useMemo(() => {
        const uniquePassedTeams = getUniquePassedTeams(passedTeams)

        return teams.filter((team) =>
            uniquePassedTeams.includes(String(team.id_team))
        )
    }, [passedTeams, teams])

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Competition Stage Management
                </p>
                <p className="text-sm opacity-70 mt-1">
                    Manage stages, schedule, status, and passed teams for each
                    competition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <Layers3 className="mb-3" />
                    <p className="text-sm opacity-70">Total Competition</p>
                    <p className="text-3xl font-bold mt-1">
                        {competitions.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <CheckCircle className="mb-3" />
                    <p className="text-sm opacity-70">Selected Competition</p>
                    <p className="text-xl font-bold mt-1">
                        {selectedCompetition?.name_competition || "-"}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">Available Teams</p>
                    <p className="text-3xl font-bold mt-1">{teams.length}</p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Competition List
                        </p>
                        <p className="text-sm opacity-70">
                            Select a competition to manage its stages.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search competition..."
                        className="w-full md:w-72 px-4 py-2 rounded-lg bg-white text-black"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3 px-3">No</th>
                                <th className="text-left py-3 px-3">
                                    Competition Name
                                </th>
                                <th className="text-left py-3 px-3">Status</th>
                                <th className="text-left py-3 px-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCompetitions.map((competition, index) => (
                                <tr
                                    key={competition.id_competition}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3 px-3">{index + 1}</td>

                                    <td className="py-3 px-3 font-medium">
                                        {competition.name_competition}
                                    </td>

                                    <td className="py-3 px-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${competition.status_competition ===
                                                    "ACTIVE"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : "bg-red-500/20 text-red-300"
                                                }`}
                                        >
                                            {competition.status_competition}
                                        </span>
                                    </td>

                                    <td className="py-3 px-3">
                                        <button
                                            onClick={() =>
                                                openStageModal(competition)
                                            }
                                            className="glass px-4 py-2 rounded-xl border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer flex items-center gap-2"
                                        >
                                            <Layers3 size={16} />
                                            Manage Stages
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!isLoading && filteredCompetitions.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-6">
                            No competition data found.
                        </p>
                    )}

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading data...
                        </p>
                    )}
                </div>
            </div>

            {isStageModalOpen && selectedCompetition && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xl font-semibold">
                                    Manage Stages
                                </p>
                                <p className="text-sm opacity-70 mt-1">
                                    {selectedCompetition.name_competition}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsStageModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="flex justify-end mb-5">
                            <button
                                onClick={openCreateStageModal}
                                className="glass px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
                            >
                                <Plus size={18} />
                                Add Stage
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left py-3 px-3">
                                            No
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Stage Name
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Start
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            End
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Passed Teams
                                        </th>
                                        <th className="text-left py-3 px-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stages.map((stage, index) => (
                                        <tr
                                            key={stage._id}
                                            className="border-b border-white/10"
                                        >
                                            <td className="py-3 px-3">
                                                {index + 1}
                                            </td>

                                            <td className="py-3 px-3 font-medium min-w-40">
                                                {stage.stage_name}
                                            </td>

                                            <td className="py-3 px-3 min-w-47.5">
                                                {new Date(
                                                    stage.start_stage
                                                ).toLocaleString()}
                                            </td>

                                            <td className="py-3 px-3 min-w-47.5">
                                                {new Date(
                                                    stage.end_stage
                                                ).toLocaleString()}
                                            </td>

                                            <td className="py-3 px-3">
                                                <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300">
                                                    {stage.status_stage || "-"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-3">
                                                {
                                                    getUniquePassedTeams(
                                                        stage.passed_teams
                                                    ).length
                                                }{" "}
                                                Team
                                            </td>

                                            <td className="py-3 px-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditStageModal(
                                                                stage
                                                            )
                                                        }
                                                        className="cursor-pointer glass p-2 rounded-lg"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openPassedTeamModal(
                                                                stage
                                                            )
                                                        }
                                                        className="cursor-pointer glass p-2 rounded-lg text-green-300"
                                                    >
                                                        <Users size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                stage
                                                            )
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

                            {!isLoading && stages.length === 0 && (
                                <p className="text-center text-sm opacity-70 py-6">
                                    No stage data found for this competition.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isStageFormModalOpen && selectedCompetition && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                {editingStage ? "Edit Stage" : "Create Stage"}
                            </p>

                            <button
                                onClick={() => {
                                    setIsStageFormModalOpen(false)
                                    setEditingStage(null)
                                }}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitStage}>
                            <div>
                                <p>Stage Name</p>
                                <input
                                    type="text"
                                    name="stage_name"
                                    value={stageForm.stage_name}
                                    onChange={handleStageChange}
                                    placeholder="Enter stage name"
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <p>Start Stage</p>
                                <input
                                    type="datetime-local"
                                    name="start_stage"
                                    value={stageForm.start_stage}
                                    onChange={handleStageChange}
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <p>End Stage</p>
                                <input
                                    type="datetime-local"
                                    name="end_stage"
                                    value={stageForm.end_stage}
                                    onChange={handleStageChange}
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    required
                                />
                            </div>

                            {editingStage && (
                                <div className="mt-4">
                                    <p>Status Stage</p>
                                    <select
                                        name="status_stage"
                                        value={stageForm.status_stage}
                                        onChange={handleStageChange}
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                        required
                                    >
                                        <option value="UPCOMING">UPCOMING</option>
                                        <option value="ONGOING">ONGOING</option>
                                        <option value="COMPLETED">
                                            COMPLETED
                                        </option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </div>
                            )}

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
                                    : editingStage
                                        ? "Update Stage"
                                        : "Create Stage"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isPassedTeamModalOpen && selectedStage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xl font-semibold">
                                    Select Passed Teams
                                </p>
                                <p className="text-sm opacity-70 mt-1">
                                    Stage: {selectedStage.stage_name}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setIsPassedTeamModalOpen(false)
                                    setSelectedStage(null)
                                    setPassedTeams([])
                                }}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        {selectedPassedTeamDetails.length > 0 && (
                            <div className="mb-5">
                                <p className="font-semibold mb-3">
                                    Current Passed Teams
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {selectedPassedTeamDetails.map((team) => (
                                        <div
                                            key={team.id_team}
                                            className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 px-3 py-2 rounded-full text-sm"
                                        >
                                            <span>{team.team_name}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemovePassedTeam(
                                                        team.id_team
                                                    )
                                                }
                                                className="cursor-pointer text-red-300 hover:text-red-200"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teams.map((team) => {
                                const isSelected = passedTeams.includes(
                                    String(team.id_team)
                                )

                                return (
                                    <label
                                        key={team.id_team}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                                ? "bg-cyan-500/10 border-cyan-400/40"
                                                : "bg-white/5 border-white/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleTogglePassedTeam(
                                                        team.id_team
                                                    )
                                                }
                                            />

                                            <div>
                                                <p className="font-medium">
                                                    {team.team_name}
                                                </p>
                                                <p className="text-sm opacity-70">
                                                    {team.institution || "-"}
                                                </p>

                                                {isSelected && (
                                                    <p className="text-xs text-cyan-300 mt-1">
                                                        Already added. Uncheck
                                                        to remove.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>

                        {teams.length === 0 && (
                            <p className="text-center text-sm opacity-70 py-6">
                                No team data found.
                            </p>
                        )}

                        <button
                            onClick={handleUpdatePassedTeams}
                            disabled={isLoading}
                            className={`w-full glass px-5 py-3 text-center mt-6 rounded-xl ${isLoading
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                        >
                            {isLoading ? "Saving..." : "Save Passed Teams"}
                        </button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && selectedStage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 size={30} className="text-red-400" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-center mt-4">
                            Delete Stage
                        </h2>

                        <p className="text-center text-white/70 mt-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-white">
                                {selectedStage.stage_name}
                            </span>
                            ?
                        </p>

                        <p className="text-center text-sm text-red-300 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setSelectedStage(null)
                                }}
                                className="cursor-pointer flex-1 glass py-3 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteStage}
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

export default CompetitionStages