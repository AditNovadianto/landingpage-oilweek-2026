import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
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
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const [form, setForm] = useState({
        name: "",
        status: "ACTIVE",
    })

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)

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

            setCompetitions(data.competitions || data.data || data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCompetitions()
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const openCreateModal = () => {
        setEditingCompetition(null)
        setForm({
            name: "",
            status: "ACTIVE",
        })
        setIsModalOpen(true)
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

        try {
            setIsLoading(true)

            const url = editingCompetition
                ? `${import.meta.env.VITE_API_BASE_URL}/updateCompetition/${editingCompetition.id_competition}`
                : `${import.meta.env.VITE_API_BASE_URL}/createCompetition`

            const method = editingCompetition ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify({
                    name: form.name,
                    status: form.status,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Gagal menyimpan competition")
                return
            }

            setToast({ message: editingCompetition ? "Competition updated successfully." : "Competition uploaded successfully.", type: "success" })

            setIsModalOpen(false)
            fetchCompetitions()
        } catch (error) {
            console.error(error)
            setToast({ message: "Something Wrong.", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedCompetition) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/deleteCompetition/${selectedCompetition.id_competition}`,
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
                    message:
                        data.error || "Failed to Delete Competition",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Deleted competition successfully.",
                type: "success",
            })

            setIsDeleteModalOpen(false)
            setSelectedCompetition(null)

            fetchCompetitions()
        } catch (error) {
            console.error(error)

            setToast({
                message: "Something Wrong.",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filteredCompetitions = competitions.filter((competition) =>
        competition.name_competition
            ?.toLowerCase()
            .includes(search.toLowerCase())
    )

    const activeCompetitions = competitions.filter(
        (competition) => competition.status_competition === "ACTIVE"
    ).length

    const nonActiveCompetitions = competitions.filter(
        (competition) => competition.status_competition !== "ACTIVE"
    ).length

    return (
        <div className="text-white space-y-6 px-10 py-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <p className="text-2xl font-bold italic">
                        Competition Management
                    </p>
                    <p className="text-sm opacity-70 mt-1">
                        Manage competition data, status, and availability.
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="cursor-pointer glass px-5 py-3 rounded-xl flex items-center gap-2 w-max"
                >
                    <Plus size={18} />
                    Add Competition
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm opacity-70">Total Competition</p>
                    <p className="text-3xl font-bold mt-1">
                        {competitions.length}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm opacity-70">Active Competition</p>
                    <p className="text-3xl font-bold mt-1">
                        {activeCompetitions}
                    </p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <p className="text-sm opacity-70">Not Active Competition</p>
                    <p className="text-3xl font-bold mt-1">
                        {nonActiveCompetitions}
                    </p>
                </div>
            </div>

            <div className="glass p-5 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                        <p className="font-semibold text-lg">
                            Competition List
                        </p>
                        <p className="text-sm opacity-70">
                            List of all registered competitions.
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
                            {filteredCompetitions.map((competition, index) => (
                                <tr
                                    key={competition.id_competition}
                                    className="border-b border-white/10"
                                >
                                    <td className="py-3">{index + 1}</td>

                                    <td className="py-3 font-medium">
                                        {competition.name_competition}
                                    </td>

                                    <td className="py-3">
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

                                    <td className="py-3">
                                        {competition.id_platform || "-"}
                                    </td>

                                    <td className="py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(competition)
                                                }
                                                className="cursor-pointer glass p-2 rounded-lg"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedCompetition(competition)
                                                    setIsDeleteModalOpen(true)
                                                }}
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

                    {!isLoading && filteredCompetitions.length === 0 && (
                        <p className="text-center text-sm opacity-70 py-6">
                            No competition data found.
                        </p>
                    )}

                    {isLoading && (
                        <p className="text-center text-sm opacity-70 py-6">
                            Loading competitions...
                        </p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                    <div className="glass p-6 rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xl font-semibold">
                                {editingCompetition
                                    ? "Edit Competition"
                                    : "Add Competition"}
                            </p>

                            <button onClick={() => setIsModalOpen(false)} className="cursor-pointer">
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
                                    <option value="NOT ACTIVE">
                                        NOT ACTIVE
                                    </option>
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
                                    : editingCompetition
                                        ? "Update Competition"
                                        : "Create Competition"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
                        <div className="glass p-6 rounded-2xl w-full max-w-md text-white">
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2
                                        size={30}
                                        className="text-red-400"
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-center mt-4">
                                Delete Competition
                            </h2>

                            <p className="text-center text-white/70 mt-2">
                                Are you sure you want to delete
                                <span className="font-semibold text-white">
                                    {" "}
                                    {selectedCompetition?.name_competition}
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
                                        setSelectedCompetition(null)
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
                                    {isLoading
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

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