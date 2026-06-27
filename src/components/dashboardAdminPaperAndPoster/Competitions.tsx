import { useEffect, useMemo, useState } from "react"
import { Trophy, Pencil, X } from "lucide-react"
import { isTokenExpired } from "../../utils/auth"
import { useNavigate } from "react-router-dom"
import Toast from "../Toast"

interface Competition {
    id_competition: number
    name_competition: string
    status_competition: string
    id_platform?: number
}

const Competitions = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCompetition, setEditingCompetition] =
        useState<Competition | null>(null)
    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const [form, setForm] = useState({
        name: "",
        status: "ACTIVE",
    })

    const navigate = useNavigate()
    const token = sessionStorage.getItem("token")

    const PAPER_AND_POSTER_KEYWORD = "paper & poster"

    useEffect(() => {
        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
        }
    }, [navigate, token])

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

            const competitionData: Competition[] =
                data.competitions || data.data || data || []

            setCompetitions(Array.isArray(competitionData) ? competitionData : [])
        } catch (error) {
            console.error(error)
            setToast({
                message: "Failed to fetch competition data.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCompetitions()
    }, [])

    const paperAndPosterCompetition = useMemo(() => {
        return competitions.find((competition) =>
            competition.name_competition
                ?.toLowerCase()
                .includes(PAPER_AND_POSTER_KEYWORD)
        )
    }, [competitions])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const openEditModal = (competition: Competition) => {
        setEditingCompetition(competition)

        setForm({
            name: competition.name_competition,
            status: competition.status_competition,
        })

        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!editingCompetition) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateCompetition/${editingCompetition.id_competition}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        name: form.name,
                        status: form.status,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Failed to update competition.",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Paper and Poster Competition updated successfully.",
                type: "success",
            })

            setIsModalOpen(false)
            setEditingCompetition(null)
            fetchCompetitions()
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

    console.log(competitions)

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <p className="text-2xl font-bold italic">
                        Paper and Poster Competition
                    </p>
                    <p className="text-sm opacity-70 mt-1">
                        Manage your assigned competition data and availability.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm opacity-70">Assigned Competition</p>
                    <p className="text-3xl font-bold mt-1">
                        {paperAndPosterCompetition ? 1 : 0}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm opacity-70">Competition Status</p>
                    <p className="text-3xl font-bold mt-1">
                        {paperAndPosterCompetition?.status_competition || "-"}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm opacity-70">Platform ID</p>
                    <p className="text-3xl font-bold mt-1">
                        {paperAndPosterCompetition?.id_platform || "-"}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Competition Detail
                        </p>
                        <p className="text-sm opacity-70">
                            Detail competition assigned to Paper and Poster Admin.
                        </p>
                    </div>

                    <Trophy />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3">No</th>
                                <th className="text-left py-3">
                                    Competition Name
                                </th>
                                <th className="text-left py-3">Status</th>
                                <th className="text-left py-3">Platform ID</th>
                                <th className="text-left py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paperAndPosterCompetition && (
                                <tr
                                    key={paperAndPosterCompetition.id_competition}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3">1</td>

                                    <td className="py-3 font-medium">
                                        {
                                            paperAndPosterCompetition.name_competition
                                        }
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${paperAndPosterCompetition.status_competition ===
                                                "ACTIVE"
                                                ? "bg-green-500/20 text-green-300"
                                                : "bg-red-500/20 text-red-300"
                                                }`}
                                        >
                                            {
                                                paperAndPosterCompetition.status_competition
                                            }
                                        </span>
                                    </td>

                                    <td className="py-3">
                                        {paperAndPosterCompetition.id_platform ||
                                            "-"}
                                    </td>

                                    <td className="py-3">
                                        <button
                                            onClick={() =>
                                                openEditModal(
                                                    paperAndPosterCompetition
                                                )
                                            }
                                            className="cursor-pointer glass p-2 rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {!isLoading && !paperAndPosterCompetition && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Paper and Poster Competition data not found.
                        </p>
                    )}

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading competition...
                        </p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                Edit Paper and Poster Competition
                            </p>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div>
                                <p>Competition Name</p>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter competition name"
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <p>Status</p>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                    required
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="NOT ACTIVE">NOT ACTIVE</option>
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
                                    : "Update Competition"}
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

export default Competitions