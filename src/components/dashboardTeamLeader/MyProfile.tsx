import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../../utils/auth"
import Toast from "../Toast"

interface User {
    id_team_leader?: string
    name_team_leader?: string
    email_team_leader?: string
    major_team_leader?: string
    phone_number_team_leader?: string
    student_id_card?: string
    twibbon?: string | null
    following_instagram?: string | null
    following_linkedin?: string | null
    following_tiktok?: string | null
    instagram_story?: string | null
    repost_competition_instagram?: string | null
}

interface FileState {
    twibbon: File | null
    following_instagram: File | null
    following_linkedin: File | null
    following_tiktok: File | null
    instagram_story: File | null
    repost_competition_instagram: File | null
}

const MyProfile = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)

    const [files, setFiles] = useState<FileState>({
        twibbon: null,
        following_instagram: null,
        following_linkedin: null,
        following_tiktok: null,
        instagram_story: null,
        repost_competition_instagram: null,
    })

    const [loading, setLoading] = useState(false)

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const closeToast = useCallback(() => {
        setToast(null)
    }, [])

    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (!token || isTokenExpired(token)) {
            sessionStorage.clear()
            localStorage.clear()
            navigate("/team-leader/sign-in")
        }
    }, [navigate])

    useEffect(() => {
        const stored = localStorage.getItem("user")

        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch (error) {
                console.error("Failed to parse user:", error)
                setUser(null)
            }
        }
    }, [])

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof FileState
    ) => {
        const selectedFile = e.target.files?.[0] || null

        if (!selectedFile) {
            setFiles((prev) => ({
                ...prev,
                [key]: null,
            }))
            return
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setToast({
                message: "Maximum file size: 2MB. Accepted formats: image, pdf.",
                type: "error",
            })

            e.target.value = ""

            setFiles((prev) => ({
                ...prev,
                [key]: null,
            }))

            return
        }

        setFiles((prev) => ({
            ...prev,
            [key]: selectedFile,
        }))
    }

    const fileFields = [
        {
            label: "Twibbon",
            key: "twibbon" as keyof FileState,
            value: user?.twibbon,
        },
        {
            label: "Following Instagram",
            key: "following_instagram" as keyof FileState,
            value: user?.following_instagram,
        },
        {
            label: "Following LinkedIn",
            key: "following_linkedin" as keyof FileState,
            value: user?.following_linkedin,
        },
        {
            label: "Following TikTok",
            key: "following_tiktok" as keyof FileState,
            value: user?.following_tiktok,
        },
        {
            label: "Instagram Story",
            key: "instagram_story" as keyof FileState,
            value: user?.instagram_story,
        },
        {
            label: "Repost Competition",
            key: "repost_competition_instagram" as keyof FileState,
            value: user?.repost_competition_instagram,
        },
    ]

    const hasSelectedFile = Object.values(files).some((file) => file !== null)

    const isAllFileUploaded = fileFields.every((field) => Boolean(field.value))

    const handleUpload = async () => {
        try {
            const token = sessionStorage.getItem("token")

            if (!token) {
                navigate("/team-leader/sign-in")
                return
            }

            const formData = new FormData()

            Object.entries(files).forEach(([key, value]) => {
                const typedKey = key as keyof FileState
                const existingValue = user?.[typedKey]

                /**
                 * File hanya dikirim kalau:
                 * 1. user memilih file
                 * 2. field tersebut masih kosong/null
                 *
                 * Jadi kalau sudah pernah upload,
                 * field itu tidak akan bisa dikirim ulang dari frontend.
                 */
                if (value && !existingValue) {
                    formData.append(key, value)
                }
            })

            const selectedValidFiles = Array.from(formData.entries())

            if (selectedValidFiles.length === 0) {
                setToast({ message: "Tidak ada file baru yang dipilih atau semua file sudah diupload sebelumnya.", type: "error" })
                return
            }

            setLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/team-leader/profile/upload`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || data.message || "Upload gagal")
            }

            setUser(data.user)
            localStorage.setItem("user", JSON.stringify(data.user))

            setFiles({
                twibbon: null,
                following_instagram: null,
                following_linkedin: null,
                following_tiktok: null,
                instagram_story: null,
                repost_competition_instagram: null,
            })

            setToast({ message: "Upload berhasil!", type: "success" })
        } catch (err) {
            console.error(err)
            setToast({ message: "Upload gagal", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="px-10 py-7 text-white">
            <p className="text-4xl font-garamond font-semibold">
                My Profile
            </p>

            <div className="glass mt-7 p-6 rounded-xl">
                {/* USER INFO */}
                <div className="mb-6">
                    <p className="text-2xl font-semibold">
                        {user?.name_team_leader || "-"}
                    </p>

                    <p className="text-gray-300">
                        {user?.email_team_leader || "-"}
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-gray-400 text-sm">
                                Major
                            </p>
                            <p className="text-white mt-1">
                                {user?.major_team_leader || "-"}
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-gray-400 text-sm">
                                Phone Number
                            </p>
                            <p className="text-white mt-1">
                                {user?.phone_number_team_leader || "-"}
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-gray-400 text-sm">
                                Student ID
                            </p>
                            <p className="text-white mt-1">
                                {user?.student_id_card || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* FILE SECTION */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-lg">
                            Registration Files
                        </p>

                        <p className="text-sm text-gray-400">
                            {fileFields.filter((field) => field.value).length}/
                            {fileFields.length} completed
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fileFields.map((field) => {
                            const alreadyUploaded = Boolean(field.value)

                            return (
                                <div
                                    key={field.key}
                                    className="bg-white/5 border border-white/10 p-4 rounded-xl"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">
                                                {field.label}
                                            </p>

                                            <p
                                                className={`text-sm mt-1 ${alreadyUploaded
                                                    ? "text-green-300"
                                                    : "text-gray-400"
                                                    }`}
                                            >
                                                {alreadyUploaded
                                                    ? "Sudah diupload dan tidak bisa diubah"
                                                    : "Belum ada file"}
                                            </p>
                                        </div>

                                        <div
                                            className={`px-3 py-1 rounded-full text-xs ${alreadyUploaded
                                                ? "bg-green-500/10 text-green-300 border border-green-400/20"
                                                : "bg-yellow-500/10 text-yellow-300 border border-yellow-400/20"
                                                }`}
                                        >
                                            {alreadyUploaded
                                                ? "Locked"
                                                : "Required"}
                                        </div>
                                    </div>

                                    {alreadyUploaded ? (
                                        <a
                                            href={field.value as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-cyan-300 text-sm underline hover:text-cyan-200"
                                        >
                                            Lihat file
                                        </a>
                                    ) : (
                                        <div className="mt-3">
                                            <label className="mt-3 flex items-center justify-between gap-3 w-full bg-gray-700/50 p-5 rounded-lg cursor-pointer hover:bg-gray-700 transition-all">
                                                <span className="text-sm text-gray-300 truncate">
                                                    {files[field.key]?.name || "No file Choosen"}
                                                </span>

                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleFileChange(e, field.key)
                                                    }
                                                />
                                            </label>

                                            <p className="text-xs text-gray-400 mt-1">
                                                Maximum file size: 2MB. Accepted formats: image, pdf.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading || !hasSelectedFile || isAllFileUploaded}
                    className="cursor-pointer mt-6 px-6 py-2 bg-cyan-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-all"
                >
                    {loading
                        ? "Uploading..."
                        : isAllFileUploaded
                            ? "All Files Uploaded"
                            : "Upload Files"}
                </button>
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

export default MyProfile