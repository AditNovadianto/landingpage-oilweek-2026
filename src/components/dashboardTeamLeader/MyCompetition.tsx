import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Trophy,
    Clock,
    ExternalLink,
    RefreshCcw,
    FileText,
    CalendarDays,
    UploadCloud,
    Loader2,
    MessageCircle,
    MapPin,
    Bus,
    StickyNote,
    CheckCircle2,
} from "lucide-react";
import { isTokenExpired } from "../../utils/auth";
import Toast from "../Toast";

interface User {
    id_team_leader?: string | number;
    name_team_leader?: string;
    email_team_leader?: string;
}

interface Team {
    id_team?: number;
    id?: number;
}

interface Registration {
    id_registration: number;
    category_registration: string;
    status_registration: string;
    payment_proof: string;
    payment_status: string;
    id_team_leader: number;
    id_competition: number;
}

interface Competition {
    id_competition: number;
    name_competition: string;
    status_competition: "ACTIVE" | "NOT ACTIVE" | string;
    id_platform: number;
}

interface Stage {
    _id: string;
    id_competition: number;
    stage_name?: string;
    description_stage?: string;
    start_stage: string;
    end_stage: string;
    passed_teams: number[];
    status_stage: string;
    createdAt: string;
    updatedAt: string;
}

interface StageSubmission {
    _id?: string;
    id?: string;
    id_stage: string;
    id_team: number;
    submission_title: string;
    submission_link: string;
    submission_note?: string;
    submission_status: string;
    createdAt?: string;
    updatedAt?: string;
}

interface WhatsAppGroup {
    name?: string;
    link?: string;
    description?: string;
}

interface VenueInformation {
    venue_name?: string;
    address?: string;
    maps_url?: string;
}

type PickupStatus = "PENDING" | "CONFIRMED" | "PICKED_UP" | "CANCELLED";

interface TeamPickupInformation {
    team_id: string;
    location_name: string;
    address?: string;
    maps_url?: string;
    pickup_time: string;
    notes?: string;
    status: PickupStatus;
}

interface CompetitionStageInfo {
    _id: string;
    id_stage: string;
    whatsapp_group?: WhatsAppGroup;
    accepts_pickup: boolean;
    team_pickup_information: TeamPickupInformation[];
    venue_information?: VenueInformation;
    additional_notes: string[];
    createdAt?: string;
    updatedAt?: string;
}

type PickupLocationName =
    | ""
    | "Universitas Indonesia Station"
    | "Pondok Cina Station"
    | "Others (Maximum of 5km from Hotel)";

interface PickupForm {
    location_name: PickupLocationName;
    address: string;
    maps_url: string;
    pickup_time: string;
    notes: string;
}

interface PickupLocationOption {
    location_name: Exclude<PickupLocationName, "">;
    address: string;
    maps_url: string;
}

interface MyCompetitionProps {
    setSection: React.Dispatch<React.SetStateAction<string>>;
}

const PICKUP_LOCATIONS: PickupLocationOption[] = [
    {
        location_name: "Universitas Indonesia Station",
        address:
            "Stasiun Universitas Indonesia, Kampus UI, Pondok Cina, Beji, Depok, Jawa Barat 16424",
        maps_url:
            "https://www.google.com/maps/search/?api=1&query=Stasiun+Universitas+Indonesia",
    },
    {
        location_name: "Pondok Cina Station",
        address:
            "Stasiun Pondok Cina, Jl. Margonda Raya, Pondok Cina, Beji, Depok, Jawa Barat 16424",
        maps_url:
            "https://www.google.com/maps/search/?api=1&query=Stasiun+Pondok+Cina",
    },
    {
        location_name: "Others (Maximum of 5km from Hotel)",
        address:
            "Other pickup point within a maximum radius of 5 km from the hotel",
        maps_url: "https://www.google.com/maps/search/?api=1&query=Hotel+Depok",
    },
];

const emptyPickupForm: PickupForm = {
    location_name: "",
    address: "",
    maps_url: "",
    pickup_time: "",
    notes: "",
};

const MyCompetition: React.FC<MyCompetitionProps> = ({ setSection }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [registration, setRegistration] = useState<Registration | null>(null);

    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [submissions, setSubmissions] = useState<StageSubmission[]>([]);
    const [stageInfos, setStageInfos] = useState<CompetitionStageInfo[]>([]);

    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(new Date());

    const [uploadingStageId, setUploadingStageId] = useState<string | null>(null);

    const [savingPickupStageId, setSavingPickupStageId] = useState<string | null>(
        null,
    );

    const [submissionTitles, setSubmissionTitles] = useState<
        Record<string, string>
    >({});

    const [submissionFiles, setSubmissionFiles] = useState<
        Record<string, File | null>
    >({});

    const [pickupForms, setPickupForms] = useState<Record<string, PickupForm>>(
        {},
    );

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token || isTokenExpired(String(token))) {
            sessionStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("team");
            localStorage.removeItem("member");
            navigate("/team-leader/sign-in");
        }
    }, [navigate]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const teamData = localStorage.getItem("team");

        if (userData) {
            setUser(JSON.parse(userData));
        }

        if (teamData) {
            setTeam(JSON.parse(teamData));
        }
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        const getCompetitionsData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitions`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.status === 202) {
                    setCompetitions([]);
                    return;
                }

                const data = await response.json();

                setCompetitions(data.competitions || []);
            } catch (error) {
                console.error("Failed to fetch competitions:", error);
                setCompetitions([]);
            } finally {
                setLoading(false);
            }
        };

        getCompetitionsData();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCountdown = (targetDate: string) => {
        const target = new Date(targetDate).getTime();
        const diff = target - now.getTime();

        if (diff <= 0) {
            return "Time has ended";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const getStageStatus = (stage: Stage) => {
        const start = new Date(stage.start_stage).getTime();
        const end = new Date(stage.end_stage).getTime();
        const current = now.getTime();

        if (current < start) {
            return "UPCOMING";
        }

        if (current >= start && current <= end) {
            return "ONGOING";
        }

        return "ENDED";
    };

    const getBadgeClass = (status: string) => {
        if (
            status === "ACTIVE" ||
            status === "ONGOING" ||
            status === "SUBMITTED" ||
            status === "PASSED" ||
            status === "APPROVED" ||
            status === "PICKED_UP"
        ) {
            return "border-green-500/30 bg-green-500/15 text-green-300";
        }

        if (status === "PENDING" || status === "UPCOMING") {
            return "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";
        }

        if (
            status === "REJECTED" ||
            status === "FAILED" ||
            status === "ENDED" ||
            status === "NOT PASSED" ||
            status === "CANCELLED"
        ) {
            return "border-red-500/30 bg-red-500/15 text-red-300";
        }

        if (status === "CHECKING" || status === "CONFIRMED") {
            return "border-blue-500/30 bg-blue-500/15 text-blue-300";
        }

        return "border-gray-500/30 bg-gray-500/15 text-gray-300";
    };

    const getCurrentTeamId = () => {
        const localTeamData = localStorage.getItem("team");
        const parsedTeam = localTeamData ? JSON.parse(localTeamData) : null;

        return (
            team?.id_team ||
            team?.id ||
            parsedTeam?.id_team ||
            parsedTeam?.id ||
            Number(localStorage.getItem("id_team")) ||
            registration?.id_team_leader ||
            null
        );
    };

    const fetchCompetitionStageInfos = async () => {
        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllCompetitionStageInfos`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to fetch competition stage information.",
                );
            }

            setStageInfos(
                data.data || data.stageInfos || data.competitionStageInfos || [],
            );
        } catch (error) {
            console.error("Failed to fetch competition stage information:", error);

            setStageInfos([]);
        }
    };

    const getMyCompetition = async (idTeamLeader: string | number) => {
        const token = sessionStorage.getItem("token");

        try {
            setLoading(true);

            const registrationResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getRegistrationByIdTeamLeader/${idTeamLeader}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (
                registrationResponse.status === 202 ||
                registrationResponse.status === 404
            ) {
                setRegistration(null);
                setStages([]);
                setSubmissions([]);
                setStageInfos([]);
                return;
            }

            const registrationData = await registrationResponse.json();

            const selectedRegistration = registrationData.registration?.[0] || null;

            if (!selectedRegistration) {
                setRegistration(null);
                setStages([]);
                setSubmissions([]);
                setStageInfos([]);
                return;
            }

            setRegistration(selectedRegistration);

            const stagesResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStagesByIdCompetition/${selectedRegistration.id_competition}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const stagesData = await stagesResponse.json();

            const fetchedStages = stagesData.data || stagesData.stages || [];

            setStages(fetchedStages);

            await fetchCompetitionStageInfos();

            const currentTeamData = localStorage.getItem("team");

            const parsedTeam = currentTeamData ? JSON.parse(currentTeamData) : null;

            const idTeam =
                parsedTeam?.id_team ||
                parsedTeam?.id ||
                selectedRegistration.id_team_leader;

            const submissionsResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getStageSubmissionsByIdTeam/${idTeam}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const submissionsData = await submissionsResponse.json();

            setSubmissions(submissionsData.data || []);
        } catch (error) {
            console.error("Failed to fetch competition detail:", error);

            setRegistration(null);
            setStages([]);
            setSubmissions([]);
            setStageInfos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");

        if (userData) {
            const parsedUser = JSON.parse(userData);

            if (parsedUser?.id_team_leader) {
                getMyCompetition(parsedUser.id_team_leader);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const sortedStages = useMemo(() => {
        return [...stages].sort(
            (a, b) =>
                new Date(a.start_stage).getTime() - new Date(b.start_stage).getTime(),
        );
    }, [stages]);

    const selectedCompetition = useMemo(() => {
        if (!registration) return null;

        return (
            competitions.find(
                (competition) =>
                    Number(competition.id_competition) ===
                    Number(registration.id_competition),
            ) || null
        );
    }, [competitions, registration]);

    const isPetrosmartCompetition = useMemo(() => {
        return Boolean(
            selectedCompetition?.name_competition
                ?.trim()
                .toLowerCase()
                .includes("petrosmart"),
        );
    }, [selectedCompetition]);

    const getSubmissionByStage = (stageId: string) => {
        return submissions.find((submission) => submission.id_stage === stageId);
    };

    const getStageInfoByStageId = (stageId: string) => {
        return stageInfos.find(
            (stageInfo) => String(stageInfo.id_stage) === String(stageId),
        );
    };

    const getMyPickupInformation = (stageInfo?: CompetitionStageInfo) => {
        const idTeam = getCurrentTeamId();

        if (!idTeam || !stageInfo) {
            return undefined;
        }

        return (stageInfo.team_pickup_information || []).find(
            (pickup) => String(pickup.team_id) === String(idTeam),
        );
    };

    const getStageQualification = (stageIndex: number) => {
        const idTeam = getCurrentTeamId();

        if (!idTeam) {
            return {
                isQualified: false,
                status: "NOT PASSED",
                note: "Team ID not found. Please refresh or contact the committee.",
            };
        }

        if (isPetrosmartCompetition) {
            const currentStage = sortedStages[stageIndex];

            if (!currentStage) {
                return {
                    isQualified: false,
                    status: "NOT AVAILABLE",
                    note: "Stage information was not found.",
                };
            }

            const currentStageStatus = getStageStatus(currentStage);
            const teamId = Number(idTeam);

            for (let i = 0; i < stageIndex; i++) {
                const previousStage = sortedStages[i];
                const previousStageStatus = getStageStatus(previousStage);
                const previousPassedTeams = previousStage.passed_teams || [];

                if (
                    previousStageStatus === "ENDED" &&
                    previousPassedTeams.length > 0 &&
                    !previousPassedTeams.includes(teamId)
                ) {
                    return {
                        isQualified: false,
                        status: "NOT PASSED",
                        note: `Your team did not pass ${previousStage.stage_name || `Stage ${i + 1}`
                            }.`,
                    };
                }
            }

            const passedTeams = currentStage.passed_teams || [];
            const isPassed = passedTeams.includes(teamId);

            if (isPassed) {
                return {
                    isQualified: true,
                    status: "PASSED",
                    note: `Congratulations! Your team passed ${currentStage.stage_name || "this stage"
                        }.`,
                };
            }

            if (currentStageStatus === "ENDED" && passedTeams.length > 0) {
                return {
                    isQualified: false,
                    status: "NOT PASSED",
                    note: `Your team did not pass ${currentStage.stage_name || "this stage"
                        }.`,
                };
            }

            if (currentStageStatus === "UPCOMING") {
                return {
                    isQualified: true,
                    status: "UPCOMING",
                    note: "This activity will be coordinated through the provided WhatsApp group.",
                };
            }

            if (currentStageStatus === "ENDED") {
                return {
                    isQualified: true,
                    status: "ENDED",
                    note: "This activity was conducted through the provided WhatsApp group.",
                };
            }

            return {
                isQualified: true,
                status: "ONGOING",
                note: "This activity is being conducted through the provided WhatsApp group.",
            };
        }

        const currentStage = sortedStages[stageIndex];

        const currentStageStatus = getStageStatus(currentStage);

        const currentSubmission = getSubmissionByStage(currentStage._id);

        const teamId = Number(idTeam);

        for (let i = 0; i < stageIndex; i++) {
            const previousStage = sortedStages[i];

            const previousStageStatus = getStageStatus(previousStage);

            const previousSubmission = getSubmissionByStage(previousStage._id);

            const previousPassedTeams = previousStage.passed_teams || [];

            const isPassedPreviousStage = previousPassedTeams.includes(teamId);

            if (previousStageStatus === "ENDED" && !isPassedPreviousStage) {
                return {
                    isQualified: false,
                    status: "NOT PASSED",
                    note: `Your team did not pass ${previousStage.stage_name || `Stage ${i + 1}`
                        }, so you cannot submit to ${currentStage.stage_name || "this stage"
                        }.`,
                };
            }

            if (!previousSubmission && previousStageStatus === "ENDED") {
                return {
                    isQualified: false,
                    status: "NOT PASSED",
                    note: `You did not submit for ${previousStage.stage_name || `Stage ${i + 1}`
                        }, so you cannot continue to ${currentStage.stage_name || "this stage"
                        }.`,
                };
            }
        }

        const passedTeams = currentStage?.passed_teams || [];

        const isPassed = passedTeams.includes(teamId);

        if (isPassed) {
            return {
                isQualified: true,
                status: "PASSED",
                note: `Congratulations! Your team passed ${currentStage.stage_name || "this stage"
                    }.`,
            };
        }

        if (currentSubmission && currentStageStatus !== "ENDED") {
            return {
                isQualified: true,
                status: "CHECKING",
                note: `Your submission for ${currentStage.stage_name || "this stage"
                    } is being checked by the committee.`,
            };
        }

        if (currentSubmission && currentStageStatus === "ENDED") {
            return {
                isQualified: false,
                status: "NOT PASSED",
                note: `Your team did not pass ${currentStage.stage_name || "this stage"
                    }.`,
            };
        }

        if (!currentSubmission && currentStageStatus === "ENDED") {
            return {
                isQualified: false,
                status: "NOT PASSED",
                note: `You did not submit for ${currentStage.stage_name || "this stage"
                    }, so your team did not pass this stage.`,
            };
        }

        return {
            isQualified: true,
            status: "ONGOING",
            note: `You are eligible to submit for ${currentStage.stage_name || "this stage"
                }.`,
        };
    };

    const visibleStages = useMemo(() => {
        const idTeam = getCurrentTeamId();

        if (!idTeam) {
            return [];
        }

        const teamId = Number(idTeam);
        const result: Stage[] = [];

        for (let i = 0; i < sortedStages.length; i++) {
            const stage = sortedStages[i];
            const stageStatus = getStageStatus(stage);

            if (isPetrosmartCompetition) {
                result.push(stage);

                if (stageStatus === "ONGOING" || stageStatus === "UPCOMING") {
                    break;
                }

                continue;
            }

            const submission = getSubmissionByStage(stage._id);
            const passedTeams = stage.passed_teams || [];
            const isPassed = passedTeams.includes(teamId);

            if (stageStatus === "ENDED" && isPassed) {
                result.push(stage);
                continue;
            }

            if (stageStatus === "ENDED" && (!submission || !isPassed)) {
                result.push(stage);
                break;
            }

            if (stageStatus === "ONGOING" || stageStatus === "UPCOMING") {
                result.push(stage);
                break;
            }
        }

        return result;
    }, [
        sortedStages,
        submissions,
        team,
        registration,
        now,
        isPetrosmartCompetition,
    ]);

    const handleUploadSubmission = async (stageId: string) => {
        const token = sessionStorage.getItem("token");

        const existingSubmission = getSubmissionByStage(stageId);

        const title =
            submissionTitles[stageId] || existingSubmission?.submission_title || "";

        const file = submissionFiles[stageId];

        const idTeam = getCurrentTeamId();

        if (!idTeam) {
            setToast({
                message: "Team ID not found.",
                type: "error",
            });
            return;
        }

        const selectedStage = sortedStages.find((stage) => stage._id === stageId);

        const stageIndex = sortedStages.findIndex((stage) => stage._id === stageId);

        if (!selectedStage || stageIndex === -1) {
            setToast({
                message: "Stage not found.",
                type: "error",
            });
            return;
        }

        const realStatus = getStageStatus(selectedStage);

        const qualification = getStageQualification(stageIndex);

        if (realStatus !== "ONGOING") {
            setToast({
                message:
                    "The timeline stage has ended. Submissions can no longer be uploaded or edited.",
                type: "error",
            });
            return;
        }

        if (!qualification.isQualified) {
            setToast({
                message: qualification.note,
                type: "error",
            });
            return;
        }

        if (!title) {
            setToast({
                message: "Please fill submission title.",
                type: "error",
            });
            return;
        }

        if (!existingSubmission && !file) {
            setToast({
                message: "Please upload submission file.",
                type: "error",
            });
            return;
        }

        const formData = new FormData();

        formData.append("id_stage", stageId);

        formData.append("id_team", String(idTeam));

        formData.append("submission_title", title);

        if (file) {
            formData.append("submission_link", file);
        }

        try {
            setUploadingStageId(stageId);

            const isUpdate = Boolean(
                existingSubmission?._id || existingSubmission?.id,
            );

            const submissionId = existingSubmission?._id || existingSubmission?.id;

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
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setToast({
                    message: data.message || "Failed to save submission.",
                    type: "error",
                });
                return;
            }

            setToast({
                message: isUpdate
                    ? "Submission updated successfully."
                    : "Submission uploaded successfully.",
                type: "success",
            });

            setSubmissionTitles((previous) => ({
                ...previous,
                [stageId]: "",
            }));

            setSubmissionFiles((previous) => ({
                ...previous,
                [stageId]: null,
            }));

            if (user?.id_team_leader) {
                await getMyCompetition(user.id_team_leader);
            }
        } catch (error) {
            console.error("Failed to save submission:", error);

            setToast({
                message: "Failed to save submission.",
                type: "error",
            });
        } finally {
            setUploadingStageId(null);
        }
    };

    const handlePickupFormChange = (
        stageId: string,
        field: keyof PickupForm,
        value: string,
    ) => {
        setPickupForms((previous) => ({
            ...previous,
            [stageId]: {
                ...(previous[stageId] || emptyPickupForm),
                [field]: value,
            },
        }));
    };

    const handlePickupLocationChange = (
        stageId: string,
        locationName: PickupLocationName,
    ) => {
        if (!locationName) {
            setPickupForms((previous) => ({
                ...previous,
                [stageId]: {
                    ...(previous[stageId] || emptyPickupForm),
                    location_name: "",
                    address: "",
                    maps_url: "",
                },
            }));
            return;
        }

        const selectedLocation = PICKUP_LOCATIONS.find(
            (location) => location.location_name === locationName,
        );

        if (!selectedLocation) return;

        setPickupForms((previous) => ({
            ...previous,
            [stageId]: {
                ...(previous[stageId] || emptyPickupForm),
                location_name: selectedLocation.location_name,
                address: selectedLocation.address,
                maps_url: selectedLocation.maps_url,
            },
        }));
    };

    const handleSubmitPickupInformation = async (
        stage: Stage,
        stageInfo: CompetitionStageInfo,
    ) => {
        const token = sessionStorage.getItem("token");

        const idTeam = getCurrentTeamId();

        if (!idTeam) {
            setToast({
                message: "Team ID not found.",
                type: "error",
            });
            return;
        }

        if (!stageInfo.accepts_pickup) {
            setToast({
                message: "Pickup information is not accepted for this stage.",
                type: "error",
            });
            return;
        }

        const currentPickupInformation = stageInfo.team_pickup_information || [];

        const existingPickup = currentPickupInformation.find(
            (pickup) => String(pickup.team_id) === String(idTeam),
        );

        if (existingPickup) {
            setToast({
                message:
                    "Your team has already submitted pickup information for this stage.",
                type: "error",
            });
            return;
        }

        const pickupForm = pickupForms[stage._id] || emptyPickupForm;

        const isValidPickupLocation = PICKUP_LOCATIONS.some(
            (location) => location.location_name === pickupForm.location_name,
        );

        if (!isValidPickupLocation) {
            setToast({
                message: "Please select one of the available pickup locations.",
                type: "error",
            });
            return;
        }

        if (
            pickupForm.location_name === "Others (Maximum of 5km from Hotel)" &&
            !pickupForm.notes.trim()
        ) {
            setToast({
                message:
                    "Please describe the detailed pickup point in the notes field.",
                type: "error",
            });
            return;
        }

        if (!pickupForm.pickup_time) {
            setToast({
                message: "Pickup time is required.",
                type: "error",
            });
            return;
        }

        const newPickupInformation: TeamPickupInformation = {
            team_id: String(idTeam),
            location_name: pickupForm.location_name.trim(),
            address: pickupForm.address.trim(),
            maps_url: pickupForm.maps_url.trim(),
            pickup_time: new Date(pickupForm.pickup_time).toISOString(),
            notes: pickupForm.notes.trim(),
            status: "PENDING",
        };

        const updatedPickupInformation = [
            ...currentPickupInformation,
            newPickupInformation,
        ];

        try {
            setSavingPickupStageId(stage._id);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateCompetitionStageInfo/${stageInfo._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        team_pickup_information: updatedPickupInformation,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setToast({
                    message:
                        data.message ||
                        data.error ||
                        "Failed to submit pickup information.",
                    type: "error",
                });
                return;
            }

            setToast({
                message: "Pickup information submitted successfully.",
                type: "success",
            });

            setPickupForms((previous) => ({
                ...previous,
                [stage._id]: emptyPickupForm,
            }));

            await fetchCompetitionStageInfos();
        } catch (error) {
            console.error("Failed to submit pickup information:", error);

            setToast({
                message: "Failed to submit pickup information.",
                type: "error",
            });
        } finally {
            setSavingPickupStageId(null);
        }
    };

    if (registration?.payment_status === "PENDING") {
        return (
            <div className="min-h-screen px-10 py-7 text-white">
                <div className="flex flex-col gap-8">
                    <div>
                        <p className="font-garamond text-4xl font-semibold text-white">
                            My Competition
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                            Track your registration, competition stages, deadline, and
                            submission status.
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

                    <h2 className="text-xl font-semibold text-white">Payment Pending</h2>

                    <p className="mt-2 max-w-md text-sm text-gray-400">
                        Your registration is pending payment. Please wait for the payment to
                        be processed to access the competition details and stages.
                    </p>

                    <a
                        href={registration.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
                    >
                        View Payment Proof
                    </a>
                </div>
            </div>
        );
    }

    if (!loading && registration && registration.payment_status !== "APPROVED") {
        return (
            <div className="min-h-screen px-10 py-7 text-white">
                <div className="flex flex-col gap-8">
                    <div>
                        <p className="font-garamond text-4xl font-semibold text-white">
                            My Competition
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                            Track your registration, competition stages, deadline, and
                            submission status.
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

                    <h2 className="text-xl font-semibold text-white">Payment Rejected</h2>

                    <p className="mt-2 max-w-md text-sm text-gray-400">
                        Your payment has not been approved by the committee yet. Competition
                        stages and submissions will be available after your payment status
                        is APPROVED.
                    </p>

                    <a
                        href={registration.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
                    >
                        View Payment Proof
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-10 py-7 text-white">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-garamond text-4xl font-semibold text-white">
                            My Competition
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                            Track your registration, competition stages, deadline, and
                            submission status.
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
                            onClick={() => setSection("competitions")}
                            className="cursor-pointer mt-6 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white"
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
                                                {selectedCompetition?.name_competition || "Competition"}
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
                                        category. Below are the active stages, timeline,
                                        qualification notes, and your submission progress.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getBadgeClass(
                                            registration.status_registration,
                                        )}`}
                                    >
                                        {registration.status_registration}
                                    </span>

                                    <span
                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getBadgeClass(
                                            registration.payment_status,
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

                                <h2 className="text-2xl font-semibold">Competition Stages</h2>
                            </div>

                            {visibleStages.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    No stages available for this competition yet.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {visibleStages.map((stage, index) => {
                                        const realStatus = getStageStatus(stage);

                                        const countdown =
                                            realStatus === "UPCOMING"
                                                ? getCountdown(stage.start_stage)
                                                : getCountdown(stage.end_stage);

                                        const submission = getSubmissionByStage(stage._id);

                                        const isUploading = uploadingStageId === stage._id;

                                        const realStageIndex = sortedStages.findIndex(
                                            (item) => item._id === stage._id,
                                        );

                                        const qualification = getStageQualification(realStageIndex);

                                        const isPaymentApproved =
                                            registration?.payment_status === "APPROVED";

                                        const canUpload =
                                            isPaymentApproved &&
                                            realStatus === "ONGOING" &&
                                            qualification.isQualified;

                                        const stageInfo = getStageInfoByStageId(stage._id);

                                        const myPickupInformation =
                                            getMyPickupInformation(stageInfo);

                                        const hasPickupInformation = Boolean(myPickupInformation);

                                        const pickupForm =
                                            pickupForms[stage._id] || emptyPickupForm;

                                        const isSavingPickup = savingPickupStageId === stage._id;

                                        return (
                                            <div
                                                key={stage._id}
                                                className="border-b border-[#7288AE]/20 pb-6 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4B5694]/40 text-sm font-bold text-[#EAE0CF]">
                                                            {realStageIndex + 1}
                                                        </div>

                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <h3 className="text-xl font-semibold text-white">
                                                                    {stage.stage_name || `Stage ${index + 1}`}
                                                                </h3>

                                                                <span
                                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(
                                                                        realStatus,
                                                                    )}`}
                                                                >
                                                                    {realStatus}
                                                                </span>

                                                                <span
                                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(
                                                                        qualification.status,
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

                                                {stageInfo && (
                                                    <div className="mt-5 flex flex-col gap-5 rounded-3xl border border-[#7288AE]/20 bg-[#0B102F]/50 p-5">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-white">
                                                                Stage Information
                                                            </h4>

                                                            <p className="mt-1 text-sm text-gray-400">
                                                                Important information provided by the
                                                                competition committee.
                                                            </p>
                                                        </div>

                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div className="rounded-2xl border border-[#7288AE]/20 bg-[#111844]/60 p-5">
                                                                <div className="flex items-center gap-2 text-[#EAE0CF]">
                                                                    <MessageCircle className="h-5 w-5" />

                                                                    <p className="font-semibold">
                                                                        WhatsApp Group
                                                                    </p>
                                                                </div>

                                                                {stageInfo.whatsapp_group?.name ||
                                                                    stageInfo.whatsapp_group?.link ? (
                                                                    <>
                                                                        <p className="mt-4 font-semibold text-white">
                                                                            {stageInfo.whatsapp_group?.name ||
                                                                                "WhatsApp Group"}
                                                                        </p>

                                                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                                                            {stageInfo.whatsapp_group?.description ||
                                                                                "No group description available."}
                                                                        </p>

                                                                        {stageInfo.whatsapp_group?.link && (
                                                                            <a
                                                                                href={stageInfo.whatsapp_group.link}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600"
                                                                            >
                                                                                Join WhatsApp Group
                                                                                <ExternalLink className="h-4 w-4" />
                                                                            </a>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <p className="mt-4 text-sm text-gray-400">
                                                                        WhatsApp group information is not available
                                                                        yet.
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="rounded-2xl border border-[#7288AE]/20 bg-[#111844]/60 p-5">
                                                                <div className="flex items-center gap-2 text-[#EAE0CF]">
                                                                    <MapPin className="h-5 w-5" />

                                                                    <p className="font-semibold">
                                                                        Venue Information
                                                                    </p>
                                                                </div>

                                                                {stageInfo.venue_information?.venue_name ||
                                                                    stageInfo.venue_information?.address ? (
                                                                    <>
                                                                        <p className="mt-4 font-semibold text-white">
                                                                            {stageInfo.venue_information
                                                                                ?.venue_name || "-"}
                                                                        </p>

                                                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                                                            {stageInfo.venue_information?.address ||
                                                                                "No venue address available."}
                                                                        </p>

                                                                        {stageInfo.venue_information?.maps_url && (
                                                                            <a
                                                                                href={
                                                                                    stageInfo.venue_information.maps_url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#7288AE]/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                                                                            >
                                                                                Open Google Maps
                                                                                <ExternalLink className="h-4 w-4" />
                                                                            </a>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <p className="mt-4 text-sm text-gray-400">
                                                                        Venue information is not available yet.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="rounded-2xl border border-[#7288AE]/20 bg-[#111844]/60 p-5">
                                                            <div className="flex items-center gap-2 text-[#EAE0CF]">
                                                                <StickyNote className="h-5 w-5" />

                                                                <p className="font-semibold">
                                                                    Additional Notes
                                                                </p>
                                                            </div>

                                                            {stageInfo.additional_notes?.length > 0 ? (
                                                                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-300">
                                                                    {stageInfo.additional_notes.map(
                                                                        (note, noteIndex) => (
                                                                            <li
                                                                                key={`${stage._id}-note-${noteIndex}`}
                                                                            >
                                                                                {note}
                                                                            </li>
                                                                        ),
                                                                    )}
                                                                </ul>
                                                            ) : (
                                                                <p className="mt-4 text-sm text-gray-400">
                                                                    No additional notes available.
                                                                </p>
                                                            )}
                                                        </div>

                                                        {stageInfo.accepts_pickup && (
                                                            <div className="rounded-2xl border border-[#7288AE]/20 bg-[#111844]/60 p-5">
                                                                <div className="flex items-center gap-2 text-[#EAE0CF]">
                                                                    <Bus className="h-5 w-5" />

                                                                    <div>
                                                                        <p className="font-semibold">
                                                                            Team Pickup Information
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            Each team can submit pickup information
                                                                            only once.
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {hasPickupInformation && myPickupInformation ? (
                                                                    <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                                                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                                                            <div className="flex items-center gap-2 text-green-300">
                                                                                <CheckCircle2 className="h-5 w-5" />

                                                                                <p className="font-semibold">
                                                                                    Pickup Information Submitted
                                                                                </p>
                                                                            </div>

                                                                            <span
                                                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(
                                                                                    myPickupInformation.status,
                                                                                )}`}
                                                                            >
                                                                                {myPickupInformation.status}
                                                                            </span>
                                                                        </div>

                                                                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                                                                            <div>
                                                                                <p className="text-xs text-gray-400">
                                                                                    Pickup Location
                                                                                </p>

                                                                                <p className="mt-1 font-semibold text-white">
                                                                                    {myPickupInformation.location_name}
                                                                                </p>
                                                                            </div>

                                                                            <div>
                                                                                <p className="text-xs text-gray-400">
                                                                                    Pickup Time
                                                                                </p>

                                                                                <p className="mt-1 font-semibold text-white">
                                                                                    {formatDate(
                                                                                        myPickupInformation.pickup_time,
                                                                                    )}
                                                                                </p>
                                                                            </div>

                                                                            <div>
                                                                                <p className="text-xs text-gray-400">
                                                                                    Address
                                                                                </p>

                                                                                <p className="mt-1 text-sm text-gray-300">
                                                                                    {myPickupInformation.address || "-"}
                                                                                </p>
                                                                            </div>

                                                                            <div>
                                                                                <p className="text-xs text-gray-400">
                                                                                    Notes
                                                                                </p>

                                                                                <p className="mt-1 text-sm text-gray-300">
                                                                                    {myPickupInformation.notes || "-"}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {myPickupInformation.maps_url && (
                                                                            <a
                                                                                href={myPickupInformation.maps_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-green-500/30 px-5 py-3 text-sm font-semibold text-green-300 hover:bg-green-500/10"
                                                                            >
                                                                                Open Pickup Location
                                                                                <ExternalLink className="h-4 w-4" />
                                                                            </a>
                                                                        )}

                                                                        <p className="mt-4 text-xs text-green-300">
                                                                            Your team has already submitted pickup
                                                                            information. Another submission cannot be
                                                                            created.
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-5">
                                                                        <div className="grid gap-4 md:grid-cols-2">
                                                                            <div>
                                                                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                                    Pickup Location
                                                                                </label>

                                                                                <select
                                                                                    value={pickupForm.location_name}
                                                                                    onChange={(event) =>
                                                                                        handlePickupLocationChange(
                                                                                            stage._id,
                                                                                            event.target
                                                                                                .value as PickupLocationName,
                                                                                        )
                                                                                    }
                                                                                    disabled={isSavingPickup}
                                                                                    className="cursor-pointer w-full rounded-2xl border border-[#7288AE]/30 bg-[#111844] px-4 py-3 text-sm text-white outline-none focus:border-[#EAE0CF] disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    <option value="">
                                                                                        Select pickup location
                                                                                    </option>

                                                                                    {PICKUP_LOCATIONS.map((location) => (
                                                                                        <option
                                                                                            key={location.location_name}
                                                                                            value={location.location_name}
                                                                                        >
                                                                                            {location.location_name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>

                                                                                <p className="mt-2 text-xs text-gray-400">
                                                                                    Address and Google Maps URL will be
                                                                                    filled automatically.
                                                                                </p>
                                                                            </div>

                                                                            <div>
                                                                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                                    Pickup Time
                                                                                </label>

                                                                                <input
                                                                                    type="datetime-local"
                                                                                    value={pickupForm.pickup_time}
                                                                                    onChange={(event) =>
                                                                                        handlePickupFormChange(
                                                                                            stage._id,
                                                                                            "pickup_time",
                                                                                            event.target.value,
                                                                                        )
                                                                                    }
                                                                                    disabled={isSavingPickup}
                                                                                    className="cursor-pointer w-full rounded-2xl border border-[#7288AE]/30 bg-[#111844] px-4 py-3 text-sm text-white outline-none focus:border-[#EAE0CF] disabled:cursor-not-allowed disabled:opacity-50"
                                                                                />
                                                                            </div>

                                                                            <div>
                                                                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                                    Address
                                                                                </label>

                                                                                <textarea
                                                                                    value={pickupForm.address}
                                                                                    placeholder="Address will be filled automatically"
                                                                                    rows={3}
                                                                                    readOnly
                                                                                    className="w-full resize-none cursor-not-allowed rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-gray-300 outline-none opacity-80"
                                                                                />
                                                                            </div>

                                                                            <div>
                                                                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                                    Google Maps URL
                                                                                </label>

                                                                                <input
                                                                                    type="url"
                                                                                    value={pickupForm.maps_url}
                                                                                    placeholder="Google Maps URL will be filled automatically"
                                                                                    readOnly
                                                                                    className="w-full cursor-not-allowed rounded-2xl border border-[#7288AE]/30 bg-[#0B102F] px-4 py-3 text-sm text-gray-300 outline-none opacity-80"
                                                                                />

                                                                                {pickupForm.maps_url && (
                                                                                    <a
                                                                                        href={pickupForm.maps_url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#EAE0CF] hover:underline"
                                                                                    >
                                                                                        Preview location
                                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="mt-4">
                                                                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                                                                Notes
                                                                                {pickupForm.location_name ===
                                                                                    "Others (Maximum of 5km from Hotel)" && (
                                                                                        <span className="ml-1 text-red-300">
                                                                                            *
                                                                                        </span>
                                                                                    )}
                                                                            </label>

                                                                            <textarea
                                                                                value={pickupForm.notes}
                                                                                onChange={(event) =>
                                                                                    handlePickupFormChange(
                                                                                        stage._id,
                                                                                        "notes",
                                                                                        event.target.value,
                                                                                    )
                                                                                }
                                                                                placeholder={
                                                                                    pickupForm.location_name ===
                                                                                        "Others (Maximum of 5km from Hotel)"
                                                                                        ? "Describe the exact pickup point within 5 km from the hotel"
                                                                                        : "Enter additional pickup notes"
                                                                                }
                                                                                rows={3}
                                                                                disabled={isSavingPickup}
                                                                                className="w-full resize-none rounded-2xl border border-[#7288AE]/30 bg-[#111844] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#EAE0CF] disabled:cursor-not-allowed disabled:opacity-50"
                                                                            />
                                                                        </div>

                                                                        <button
                                                                            type="button"
                                                                            disabled={isSavingPickup}
                                                                            onClick={() =>
                                                                                handleSubmitPickupInformation(
                                                                                    stage,
                                                                                    stageInfo,
                                                                                )
                                                                            }
                                                                            className="cursor-pointer mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EAE0CF] px-6 py-3 text-sm font-semibold text-[#111844] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                                                        >
                                                                            {isSavingPickup ? (
                                                                                <>
                                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                                    Saving...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Bus className="h-4 w-4" />
                                                                                    Submit Pickup Information
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {!isPetrosmartCompetition && (
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
                                                                                submission.submission_status,
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
                                                                        onChange={(event) =>
                                                                            setSubmissionTitles((previous) => ({
                                                                                ...previous,
                                                                                [stage._id]: event.target.value,
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
                                                                        onChange={(event) =>
                                                                            setSubmissionFiles((previous) => ({
                                                                                ...previous,
                                                                                [stage._id]:
                                                                                    event.target.files?.[0] || null,
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

                                                            {qualification.isQualified &&
                                                                realStatus === "UPCOMING" && (
                                                                    <p className="text-sm text-yellow-300">
                                                                        Submission belum dibuka. Kamu bisa upload
                                                                        saat stage sudah dimulai.
                                                                    </p>
                                                                )}

                                                            {qualification.isQualified &&
                                                                realStatus === "ENDED" && (
                                                                    <p className="text-sm text-red-300">
                                                                        The timeline stage has ended. Submissions
                                                                        can no longer be uploaded or edited.
                                                                    </p>
                                                                )}

                                                            {qualification.isQualified &&
                                                                realStatus === "ONGOING" &&
                                                                submission && (
                                                                    <p className="text-sm text-green-300">
                                                                        The timeline is still active. You can still
                                                                        edit or re-upload your submission.
                                                                    </p>
                                                                )}

                                                            {qualification.isQualified &&
                                                                realStatus === "ONGOING" &&
                                                                !submission && (
                                                                    <p className="text-sm text-green-300">
                                                                        The timeline is currently in progress. You
                                                                        can upload your submission for this stage.
                                                                    </p>
                                                                )}

                                                            <button
                                                                type="button"
                                                                disabled={!canUpload || isUploading}
                                                                onClick={() =>
                                                                    handleUploadSubmission(stage._id)
                                                                }
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
                                                )}

                                                {isPetrosmartCompetition && (
                                                    <div className="mt-5 rounded-3xl border border-green-500/20 bg-green-500/10 p-5">
                                                        <div className="flex items-start gap-3">
                                                            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-300" />

                                                            <div>
                                                                <h4 className="font-semibold text-white">
                                                                    Petrosmart Competition Information
                                                                </h4>

                                                                <p className="mt-2 text-sm leading-6 text-gray-300">
                                                                    No submission is required through this
                                                                    dashboard. Petrosmart Competition activities,
                                                                    instructions, and participant coordination
                                                                    will be conducted through the WhatsApp group
                                                                    provided by the committee.
                                                                </p>

                                                                {stageInfo?.whatsapp_group?.link ? (
                                                                    <a
                                                                        href={stageInfo.whatsapp_group.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600"
                                                                    >
                                                                        Join WhatsApp Group
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </a>
                                                                ) : (
                                                                    <p className="mt-4 text-sm text-yellow-300">
                                                                        The WhatsApp group link is not available
                                                                        yet.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={closeToast} />
            )}
        </div>
    );
};

export default MyCompetition;
