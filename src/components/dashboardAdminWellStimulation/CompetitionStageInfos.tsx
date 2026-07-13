import { useEffect, useMemo, useState } from "react"
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Info,
    MessageCircle,
    MapPin,
    Bus,
    Users,
    StickyNote,
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

interface WhatsAppGroup {
    name?: string
    link?: string
    description?: string
}

interface VenueInformation {
    venue_name?: string
    address?: string
    maps_url?: string
}

type PickupStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PICKED_UP"
    | "CANCELLED"

interface TeamPickupInformation {
    team_id: string
    location_name: string
    address?: string
    maps_url?: string
    pickup_time: string
    notes?: string
    status: PickupStatus
}

interface CompetitionStageInfo {
    _id: string
    id_stage: string
    whatsapp_group?: WhatsAppGroup
    accepts_pickup: boolean
    team_pickup_information: TeamPickupInformation[]
    venue_information?: VenueInformation
    additional_notes: string[]
    createdAt?: string
    updatedAt?: string
}

interface StageWithInfo extends Stage {
    stageInfo: CompetitionStageInfo | null
}

interface StageInfoForm {
    whatsapp_group: {
        name: string
        link: string
        description: string
    }
    accepts_pickup: boolean
    venue_information: {
        venue_name: string
        address: string
        maps_url: string
    }
    additional_notes: string[]
}

const emptyForm: StageInfoForm = {
    whatsapp_group: {
        name: "",
        link: "",
        description: "",
    },
    accepts_pickup: false,
    venue_information: {
        venue_name: "",
        address: "",
        maps_url: "",
    },
    additional_notes: [],
}

const CompetitionStageInfos = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const [mudInnovationCompetition, setPaperAndPosterCompetition] =
        useState<Competition | null>(null)

    const [stages, setStages] = useState<Stage[]>([])
    const [stageInfos, setStageInfos] = useState<CompetitionStageInfo[]>([])

    const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
    const [selectedStageInfo, setSelectedStageInfo] =
        useState<CompetitionStageInfo | null>(null)

    const [stageInfoForm, setStageInfoForm] =
        useState<StageInfoForm>(emptyForm)

    const [noteInput, setNoteInput] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        await Promise.all([
            fetchCaseStudyCompetition(),
            fetchAllCompetitionStageInfos(),
        ])
    }

    const fetchCaseStudyCompetition = async () => {
        try {
            setIsLoading(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to fetch competitions.",
                )
            }

            const competitions: Competition[] =
                result.competitions || result.data || result || []

            const mudInnovation = competitions.find((competition) =>
                competition.name_competition
                    ?.toLowerCase()
                    .includes("well stimulation"),
            )

            if (!mudInnovation) {
                setToast({
                    message: "Well Stimulation competition not found.",
                    type: "error",
                })
                return
            }

            setPaperAndPosterCompetition(mudInnovation)

            await fetchStagesByCompetition(
                mudInnovation.id_competition,
            )
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch Well Stimulation competition.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStagesByCompetition = async (
        idCompetition: number,
    ) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStagesByIdCompetition/${idCompetition}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to fetch stages.",
                )
            }

            setStages(result.stages || result.data || result || [])
        } catch (error) {
            console.error(error)
            setStages([])

            setToast({
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch stages.",
                type: "error",
            })
        }
    }

    const fetchAllCompetitionStageInfos = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitionStageInfos`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to fetch stage information.",
                )
            }

            setStageInfos(result.data || result.stageInfos || result || [])
        } catch (error) {
            console.error(error)
            setStageInfos([])

            setToast({
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch stage information.",
                type: "error",
            })
        }
    }

    const stagesWithInfo = useMemo<StageWithInfo[]>(() => {
        return stages.map((stage) => {
            const stageInfo =
                stageInfos.find(
                    (info) =>
                        String(info.id_stage) === String(stage._id),
                ) || null

            return {
                ...stage,
                stageInfo,
            }
        })
    }, [stages, stageInfos])

    const totalStageInfos = useMemo(() => {
        return stagesWithInfo.filter((stage) => stage.stageInfo).length
    }, [stagesWithInfo])

    const pickupEnabledStages = useMemo(() => {
        return stagesWithInfo.filter(
            (stage) => stage.stageInfo?.accepts_pickup,
        ).length
    }, [stagesWithInfo])

    const totalPickupTeams = useMemo(() => {
        return stagesWithInfo.reduce((total, stage) => {
            return (
                total +
                (stage.stageInfo?.team_pickup_information?.length || 0)
            )
        }, 0)
    }, [stagesWithInfo])

    const resetForm = () => {
        setStageInfoForm(emptyForm)
        setNoteInput("")
        setSelectedStage(null)
        setSelectedStageInfo(null)
    }

    const openCreateModal = (stage: Stage) => {
        setSelectedStage(stage)
        setSelectedStageInfo(null)
        setStageInfoForm(emptyForm)
        setNoteInput("")
        setIsFormModalOpen(true)
    }

    const openEditModal = (
        stage: Stage,
        stageInfo: CompetitionStageInfo,
    ) => {
        setSelectedStage(stage)
        setSelectedStageInfo(stageInfo)

        setStageInfoForm({
            whatsapp_group: {
                name: stageInfo.whatsapp_group?.name || "",
                link: stageInfo.whatsapp_group?.link || "",
                description:
                    stageInfo.whatsapp_group?.description || "",
            },
            accepts_pickup: stageInfo.accepts_pickup || false,
            venue_information: {
                venue_name:
                    stageInfo.venue_information?.venue_name || "",
                address: stageInfo.venue_information?.address || "",
                maps_url:
                    stageInfo.venue_information?.maps_url || "",
            },
            additional_notes: stageInfo.additional_notes || [],
        })

        setNoteInput("")
        setIsFormModalOpen(true)
    }

    const openDetailModal = (
        stage: Stage,
        stageInfo: CompetitionStageInfo,
    ) => {
        setSelectedStage(stage)
        setSelectedStageInfo(stageInfo)
        setIsDetailModalOpen(true)
    }

    const openDeleteModal = (
        stage: Stage,
        stageInfo: CompetitionStageInfo,
    ) => {
        setSelectedStage(stage)
        setSelectedStageInfo(stageInfo)
        setIsDeleteModalOpen(true)
    }

    const closeFormModal = () => {
        setIsFormModalOpen(false)
        resetForm()
    }

    const handleWhatsAppChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = event.target

        setStageInfoForm((previous) => ({
            ...previous,
            whatsapp_group: {
                ...previous.whatsapp_group,
                [name]: value,
            },
        }))
    }

    const handleVenueChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = event.target

        setStageInfoForm((previous) => ({
            ...previous,
            venue_information: {
                ...previous.venue_information,
                [name]: value,
            },
        }))
    }

    const handleAddNote = () => {
        const normalizedNote = noteInput.trim()

        if (!normalizedNote) return

        setStageInfoForm((previous) => ({
            ...previous,
            additional_notes: [
                ...previous.additional_notes,
                normalizedNote,
            ],
        }))

        setNoteInput("")
    }

    const handleRemoveNote = (noteIndex: number) => {
        setStageInfoForm((previous) => ({
            ...previous,
            additional_notes:
                previous.additional_notes.filter(
                    (_, index) => index !== noteIndex,
                ),
        }))
    }

    const removeEmptyObject = <T extends Record<string, string>>(
        value: T,
    ): T | undefined => {
        const hasValue = Object.values(value).some(
            (item) => item.trim() !== "",
        )

        return hasValue ? value : undefined
    }

    const handleSubmitStageInfo = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault()

        if (!selectedStage) return

        try {
            setIsSaving(true)

            const isEditing = Boolean(selectedStageInfo)

            const url = isEditing
                ? `${import.meta.env.VITE_API_BASE_URL}/updateCompetitionStageInfo/${selectedStageInfo?._id}`
                : `${import.meta.env.VITE_API_BASE_URL}/createCompetitionStageInfo`

            const method = isEditing ? "PUT" : "POST"

            const body = {
                ...(isEditing
                    ? {}
                    : {
                        id_stage: selectedStage._id,
                    }),

                whatsapp_group: removeEmptyObject(
                    stageInfoForm.whatsapp_group,
                ),

                accepts_pickup: stageInfoForm.accepts_pickup,

                venue_information: removeEmptyObject(
                    stageInfoForm.venue_information,
                ),

                additional_notes:
                    stageInfoForm.additional_notes,
            }

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to save stage information.",
                )
            }

            setToast({
                message: isEditing
                    ? "Competition stage information updated successfully."
                    : "Competition stage information created successfully.",
                type: "success",
            })

            closeFormModal()
            await fetchAllCompetitionStageInfos()
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to save competition stage information.",
                type: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handlePickupStatusChange = (
        teamId: string,
        status: PickupStatus,
    ) => {
        if (!selectedStageInfo) return

        setSelectedStageInfo((previous) => {
            if (!previous) return previous

            return {
                ...previous,
                team_pickup_information:
                    previous.team_pickup_information.map((pickup) =>
                        String(pickup.team_id) === String(teamId)
                            ? {
                                ...pickup,
                                status,
                            }
                            : pickup,
                    ),
            }
        })
    }

    const handleSavePickupStatuses = async () => {
        if (!selectedStageInfo) return

        try {
            setIsSaving(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateCompetitionStageInfo/${selectedStageInfo._id}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        team_pickup_information:
                            selectedStageInfo.team_pickup_information,
                    }),
                },
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to update pickup statuses.",
                )
            }

            setToast({
                message:
                    "Team pickup statuses updated successfully.",
                type: "success",
            })

            setIsDetailModalOpen(false)
            setSelectedStage(null)
            setSelectedStageInfo(null)

            await fetchAllCompetitionStageInfos()
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update pickup statuses.",
                type: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteStageInfo = async () => {
        if (!selectedStageInfo) return

        try {
            setIsSaving(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/deleteCompetitionStageInfo/${selectedStageInfo._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Failed to delete stage information.",
                )
            }

            setToast({
                message:
                    "Competition stage information deleted successfully.",
                type: "success",
            })

            setIsDeleteModalOpen(false)
            setSelectedStage(null)
            setSelectedStageInfo(null)

            await fetchAllCompetitionStageInfos()
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete competition stage information.",
                type: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const formatDate = (date?: string) => {
        if (!date) return "-"

        return new Date(date).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        })
    }

    const getPickupStatusClass = (status: PickupStatus) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-blue-500/10 text-blue-300"
            case "PICKED_UP":
                return "bg-green-500/10 text-green-300"
            case "CANCELLED":
                return "bg-red-500/10 text-red-300"
            default:
                return "bg-yellow-500/10 text-yellow-300"
        }
    }

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div>
                <p className="text-2xl font-bold italic">
                    Well Stimulation Stage Information
                </p>

                <p className="text-sm opacity-70 mt-1">
                    Manage WhatsApp groups, pickup availability,
                    venues, notes, and team pickup statuses for each
                    Well Stimulation competition stage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <Info className="mb-3" />
                    <p className="text-sm opacity-70">Total Stages</p>
                    <p className="text-3xl font-bold mt-1">
                        {stages.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <MessageCircle className="mb-3" />
                    <p className="text-sm opacity-70">
                        Stages With Info
                    </p>
                    <p className="text-3xl font-bold mt-1">
                        {totalStageInfos}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Bus className="mb-3" />
                    <p className="text-sm opacity-70">
                        Pickup Enabled
                    </p>
                    <p className="text-3xl font-bold mt-1">
                        {pickupEnabledStages}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <Users className="mb-3" />
                    <p className="text-sm opacity-70">
                        Pickup Teams
                    </p>
                    <p className="text-3xl font-bold mt-1">
                        {totalPickupTeams}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="mb-5">
                    <p className="font-semibold text-lg">
                        Competition Stage Information
                    </p>

                    <p className="text-sm opacity-70">
                        Competition:{" "}
                        {mudInnovationCompetition?.name_competition ||
                            "-"}
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
                                    Stage
                                </th>
                                <th className="text-left py-3 px-3">
                                    WhatsApp Group
                                </th>
                                <th className="text-left py-3 px-3">
                                    Pickup
                                </th>
                                <th className="text-left py-3 px-3">
                                    Venue
                                </th>
                                <th className="text-left py-3 px-3">
                                    Team Pickup
                                </th>
                                <th className="text-left py-3 px-3">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {stagesWithInfo.map((stage, index) => {
                                const info = stage.stageInfo

                                return (
                                    <tr
                                        key={stage._id}
                                        className="border-b border-white/10"
                                    >
                                        <td className="py-3 px-3">
                                            {index + 1}
                                        </td>

                                        <td className="py-3 px-3 min-w-45">
                                            <p className="font-medium">
                                                {stage.stage_name}
                                            </p>
                                            <p className="text-xs opacity-60 mt-1">
                                                {stage.status_stage ||
                                                    "-"}
                                            </p>
                                        </td>

                                        <td className="py-3 px-3 min-w-52">
                                            {info?.whatsapp_group
                                                ?.name ? (
                                                <>
                                                    <p>
                                                        {
                                                            info
                                                                .whatsapp_group
                                                                .name
                                                        }
                                                    </p>

                                                    {info
                                                        .whatsapp_group
                                                        .link && (
                                                            <a
                                                                href={
                                                                    info
                                                                        .whatsapp_group
                                                                        .link
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-green-300 text-xs hover:underline"
                                                            >
                                                                Open group
                                                            </a>
                                                        )}
                                                </>
                                            ) : (
                                                <span className="opacity-50">
                                                    Not available
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3 px-3">
                                            {info ? (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs ${info.accepts_pickup
                                                        ? "bg-green-500/10 text-green-300"
                                                        : "bg-red-500/10 text-red-300"
                                                        }`}
                                                >
                                                    {info.accepts_pickup
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            ) : (
                                                <span className="opacity-50">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3 px-3 min-w-45">
                                            {info?.venue_information
                                                ?.venue_name || (
                                                    <span className="opacity-50">
                                                        Not available
                                                    </span>
                                                )}
                                        </td>

                                        <td className="py-3 px-3">
                                            {info
                                                ?.team_pickup_information
                                                ?.length || 0}{" "}
                                            Team
                                        </td>

                                        <td className="py-3 px-3">
                                            {!info ? (
                                                <button
                                                    onClick={() =>
                                                        openCreateModal(
                                                            stage,
                                                        )
                                                    }
                                                    className="glass px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Plus size={16} />
                                                    Add Info
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openDetailModal(
                                                                stage,
                                                                info,
                                                            )
                                                        }
                                                        className="glass p-2 rounded-lg text-cyan-300 cursor-pointer"
                                                        title="View information"
                                                    >
                                                        <Info
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                stage,
                                                                info,
                                                            )
                                                        }
                                                        className="glass p-2 rounded-lg cursor-pointer"
                                                        title="Edit information"
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                stage,
                                                                info,
                                                            )
                                                        }
                                                        className="glass p-2 rounded-lg text-red-300 cursor-pointer"
                                                        title="Delete information"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading data...
                        </p>
                    )}

                    {!isLoading && stages.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-6">
                            No competition stages found.
                        </p>
                    )}
                </div>
            </div>

            {isFormModalOpen && selectedStage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xl font-semibold">
                                    {selectedStageInfo
                                        ? "Update Stage Information"
                                        : "Create Stage Information"}
                                </p>

                                <p className="text-sm opacity-70 mt-1">
                                    Stage: {selectedStage.stage_name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeFormModal}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitStageInfo}>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageCircle size={18} />
                                    <p className="font-semibold">
                                        WhatsApp Group
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm">
                                        Group Name
                                    </p>
                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            stageInfoForm
                                                .whatsapp_group.name
                                        }
                                        onChange={
                                            handleWhatsAppChange
                                        }
                                        placeholder="Example: WhatsApp Group Semifinal"
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    />
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm">
                                        Group Link
                                    </p>
                                    <input
                                        type="url"
                                        name="link"
                                        value={
                                            stageInfoForm
                                                .whatsapp_group.link
                                        }
                                        onChange={
                                            handleWhatsAppChange
                                        }
                                        placeholder="https://chat.whatsapp.com/..."
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    />
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm">
                                        Description
                                    </p>
                                    <textarea
                                        name="description"
                                        value={
                                            stageInfoForm
                                                .whatsapp_group
                                                .description
                                        }
                                        onChange={
                                            handleWhatsAppChange
                                        }
                                        placeholder="Enter group description"
                                        rows={3}
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-5">
                                <div className="flex items-center gap-2">
                                    <Bus size={18} />
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            Pickup Availability
                                        </p>
                                        <p className="text-sm opacity-70">
                                            Enable pickup registration
                                            for this stage.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            stageInfoForm.accepts_pickup
                                        }
                                        onChange={(event) =>
                                            setStageInfoForm(
                                                (previous) => ({
                                                    ...previous,
                                                    accepts_pickup:
                                                        event.target
                                                            .checked,
                                                }),
                                            )
                                        }
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={18} />
                                    <p className="font-semibold">
                                        Venue Information
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm">
                                        Venue Name
                                    </p>
                                    <input
                                        type="text"
                                        name="venue_name"
                                        value={
                                            stageInfoForm
                                                .venue_information
                                                .venue_name
                                        }
                                        onChange={
                                            handleVenueChange
                                        }
                                        placeholder="Enter venue name"
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    />
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm">
                                        Address
                                    </p>
                                    <textarea
                                        name="address"
                                        value={
                                            stageInfoForm
                                                .venue_information
                                                .address
                                        }
                                        onChange={
                                            handleVenueChange
                                        }
                                        placeholder="Enter venue address"
                                        rows={3}
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black resize-none"
                                    />
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm">
                                        Google Maps URL
                                    </p>
                                    <input
                                        type="url"
                                        name="maps_url"
                                        value={
                                            stageInfoForm
                                                .venue_information
                                                .maps_url
                                        }
                                        onChange={
                                            handleVenueChange
                                        }
                                        placeholder="https://maps.google.com/..."
                                        className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <StickyNote size={18} />
                                    <p className="font-semibold">
                                        Additional Notes
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={noteInput}
                                        onChange={(event) =>
                                            setNoteInput(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                event.preventDefault()
                                                handleAddNote()
                                            }
                                        }}
                                        placeholder="Enter additional note"
                                        className="w-full rounded-lg px-3 py-2 bg-white text-black"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAddNote}
                                        className="glass px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {stageInfoForm.additional_notes
                                    .length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            {stageInfoForm.additional_notes.map(
                                                (note, index) => (
                                                    <div
                                                        key={`${note}-${index}`}
                                                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5"
                                                    >
                                                        <p className="text-sm">
                                                            {note}
                                                        </p>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveNote(
                                                                    index,
                                                                )
                                                            }
                                                            className="text-red-300 cursor-pointer"
                                                        >
                                                            <X
                                                                size={16}
                                                            />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`w-full glass px-5 py-3 text-center mt-6 rounded-xl ${isSaving
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                    }`}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : selectedStageInfo
                                        ? "Update Information"
                                        : "Create Information"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDetailModalOpen &&
                selectedStage &&
                selectedStageInfo && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                        <div className="glass p-6 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-xl font-semibold">
                                        Stage Information
                                    </p>

                                    <p className="text-sm opacity-70 mt-1">
                                        Stage:{" "}
                                        {selectedStage.stage_name}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDetailModalOpen(
                                            false,
                                        )
                                        setSelectedStage(null)
                                        setSelectedStageInfo(null)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="font-semibold">
                                        WhatsApp Group
                                    </p>

                                    <p className="mt-3">
                                        {selectedStageInfo
                                            .whatsapp_group?.name ||
                                            "-"}
                                    </p>

                                    <p className="text-sm opacity-70 mt-1">
                                        {selectedStageInfo
                                            .whatsapp_group
                                            ?.description || "-"}
                                    </p>

                                    {selectedStageInfo
                                        .whatsapp_group?.link && (
                                            <a
                                                href={
                                                    selectedStageInfo
                                                        .whatsapp_group
                                                        .link
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block mt-3 text-green-300 hover:underline"
                                            >
                                                Open WhatsApp Group
                                            </a>
                                        )}
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="font-semibold">
                                        Venue
                                    </p>

                                    <p className="mt-3">
                                        {selectedStageInfo
                                            .venue_information
                                            ?.venue_name || "-"}
                                    </p>

                                    <p className="text-sm opacity-70 mt-1">
                                        {selectedStageInfo
                                            .venue_information
                                            ?.address || "-"}
                                    </p>

                                    {selectedStageInfo
                                        .venue_information
                                        ?.maps_url && (
                                            <a
                                                href={
                                                    selectedStageInfo
                                                        .venue_information
                                                        .maps_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block mt-3 text-cyan-300 hover:underline"
                                            >
                                                Open Maps
                                            </a>
                                        )}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4">
                                <p className="font-semibold">
                                    Additional Notes
                                </p>

                                {selectedStageInfo.additional_notes
                                    .length > 0 ? (
                                    <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
                                        {selectedStageInfo.additional_notes.map(
                                            (note, index) => (
                                                <li
                                                    key={`${note}-${index}`}
                                                >
                                                    {note}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm opacity-60 mt-3">
                                        No additional notes.
                                    </p>
                                )}
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">
                                            Team Pickup Information
                                        </p>

                                        <p className="text-sm opacity-70 mt-1">
                                            Pickup availability:{" "}
                                            {selectedStageInfo.accepts_pickup
                                                ? "Available"
                                                : "Unavailable"}
                                        </p>
                                    </div>

                                    <span className="text-sm">
                                        {
                                            selectedStageInfo
                                                .team_pickup_information
                                                .length
                                        }{" "}
                                        Team
                                    </span>
                                </div>

                                {selectedStageInfo
                                    .team_pickup_information
                                    .length > 0 ? (
                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/20">
                                                    <th className="text-left py-3 px-3">
                                                        Team ID
                                                    </th>
                                                    <th className="text-left py-3 px-3">
                                                        Location
                                                    </th>
                                                    <th className="text-left py-3 px-3">
                                                        Pickup Time
                                                    </th>
                                                    <th className="text-left py-3 px-3">
                                                        Notes
                                                    </th>
                                                    <th className="text-left py-3 px-3">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedStageInfo.team_pickup_information.map(
                                                    (pickup) => (
                                                        <tr
                                                            key={
                                                                pickup.team_id
                                                            }
                                                            className="border-b border-white/10"
                                                        >
                                                            <td className="py-3 px-3">
                                                                {
                                                                    pickup.team_id
                                                                }
                                                            </td>

                                                            <td className="py-3 px-3 min-w-52">
                                                                <p>
                                                                    {
                                                                        pickup.location_name
                                                                    }
                                                                </p>

                                                                <p className="text-xs opacity-60 mt-1">
                                                                    {pickup.address ||
                                                                        "-"}
                                                                </p>

                                                                {pickup.maps_url && (
                                                                    <a
                                                                        href={
                                                                            pickup.maps_url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-cyan-300 text-xs hover:underline"
                                                                    >
                                                                        Open
                                                                        Maps
                                                                    </a>
                                                                )}
                                                            </td>

                                                            <td className="py-3 px-3 min-w-44">
                                                                {formatDate(
                                                                    pickup.pickup_time,
                                                                )}
                                                            </td>

                                                            <td className="py-3 px-3 min-w-44">
                                                                {pickup.notes ||
                                                                    "-"}
                                                            </td>

                                                            <td className="py-3 px-3 min-w-44">
                                                                <select
                                                                    value={
                                                                        pickup.status
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        handlePickupStatusChange(
                                                                            pickup.team_id,
                                                                            event
                                                                                .target
                                                                                .value as PickupStatus,
                                                                        )
                                                                    }
                                                                    className={`rounded-lg px-3 py-2 bg-black/40 border border-white/10 ${getPickupStatusClass(
                                                                        pickup.status,
                                                                    )}`}
                                                                >
                                                                    <option value="PENDING">
                                                                        PENDING
                                                                    </option>
                                                                    <option value="CONFIRMED">
                                                                        CONFIRMED
                                                                    </option>
                                                                    <option value="PICKED_UP">
                                                                        PICKED_UP
                                                                    </option>
                                                                    <option value="CANCELLED">
                                                                        CANCELLED
                                                                    </option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-sm opacity-60 py-6">
                                        No team pickup information
                                        found.
                                    </p>
                                )}

                                {selectedStageInfo
                                    .team_pickup_information
                                    .length > 0 && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleSavePickupStatuses
                                            }
                                            disabled={isSaving}
                                            className={`w-full glass px-5 py-3 text-center mt-5 rounded-xl ${isSaving
                                                ? "opacity-60 cursor-not-allowed"
                                                : "cursor-pointer"
                                                }`}
                                        >
                                            {isSaving
                                                ? "Saving..."
                                                : "Save Pickup Statuses"}
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

            {isDeleteModalOpen &&
                selectedStage &&
                selectedStageInfo && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 px-5">
                        <div className="glass p-6 rounded-2xl w-full max-w-md">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2
                                        size={30}
                                        className="text-red-400"
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-center mt-4">
                                Delete Stage Information
                            </h2>

                            <p className="text-center text-white/70 mt-2">
                                Are you sure you want to delete the
                                information for{" "}
                                <span className="font-semibold text-white">
                                    {selectedStage.stage_name}
                                </span>
                                ?
                            </p>

                            <p className="text-center text-sm text-red-300 mt-2">
                                The competition stage itself will not
                                be deleted.
                            </p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false)
                                        setSelectedStage(null)
                                        setSelectedStageInfo(null)
                                    }}
                                    className="cursor-pointer flex-1 glass py-3 rounded-xl"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDeleteStageInfo
                                    }
                                    disabled={isSaving}
                                    className="cursor-pointer flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isSaving
                                        ? "Deleting..."
                                        : "Delete"}
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

export default CompetitionStageInfos