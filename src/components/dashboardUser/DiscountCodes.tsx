import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    BadgePercent,
    Pencil,
    Plus,
    RefreshCcw,
    Trash2,
    Users,
    X,
    TriangleAlert,
} from "lucide-react"

import Toast from "../../components/Toast"
import { isTokenExpired } from "../../utils/auth"

interface RedeemedBy {
    id_team_leader: number
    id_registration: number
    transaction_amount: number
    discount_amount: number
    final_amount: number
    redeemed_at: string
}

interface DiscountCode {
    _id: string
    code: string
    discount_type: "PERCENTAGE" | "FIXED"
    discount_value: number
    start_date: string
    end_date: string
    usage_limit: number | null
    used_count: number
    redeemed_by: RedeemedBy[]
    is_active: boolean
    createdAt: string
    updatedAt: string
}

interface TeamLeader {
    id_team_leader: number
    name_team_leader: string
    major_team_leader: string
    email_team_leader: string
    phone_number_team_leader: string
    student_id_card: string
    twibbon?: string
    following_instagram?: string
    // following_linkedin?: string
    following_tiktok?: string
    instagram_story?: string
    repost_competition_instagram?: string
}

interface DiscountCodeForm {
    code: string
    discount_type: "PERCENTAGE" | "FIXED"
    discount_value: string
    start_date: string
    end_date: string
    usage_limit: string
    is_active: boolean
}

const initialForm: DiscountCodeForm = {
    code: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
    is_active: true,
}

const DiscountCodes = () => {
    const navigate = useNavigate()

    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])

    const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([])

    const [form, setForm] =
        useState<DiscountCodeForm>(initialForm)

    const [editForm, setEditForm] =
        useState<DiscountCodeForm>(initialForm)

    const [selectedDiscount, setSelectedDiscount] =
        useState<DiscountCode | null>(null)

    const [discountToDelete, setDiscountToDelete] =
        useState<DiscountCode | null>(null)

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false)

    const [isRedeemedModalOpen, setIsRedeemedModalOpen] =
        useState(false)

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false)

    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    const [errors, setErrors] = useState({
        code: "",
        discount_value: "",
        start_date: "",
        end_date: "",
        usage_limit: "",
    })

    const [editErrors, setEditErrors] = useState({
        code: "",
        discount_value: "",
        start_date: "",
        end_date: "",
        usage_limit: "",
    })

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (!token || isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
            return
        }

        fetchDiscountCodes()
        fetchTeamLeaders()
    }, [navigate])

    const fetchDiscountCodes = async () => {
        try {
            setIsFetching(true)

            const token = sessionStorage.getItem("token")

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getDiscountCodes`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setToast({
                    message:
                        data.message ||
                        "Failed to get discount codes",
                    type: "error",
                })

                return
            }

            setDiscountCodes(data.data || [])
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    "Something went wrong while fetching discount codes",
                type: "error",
            })
        } finally {
            setIsFetching(false)
        }
    }

    const fetchTeamLeaders = async () => {
        try {
            setIsFetching(true)

            const token = sessionStorage.getItem("token")

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/getAllTeamLeaders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            setTeamLeaders(data.teamLeaders || data.data || data)
        } catch (error) {
            console.error(error)
            setToast({
                message: "Failed to fetch team leaders.",
                type: "error",
            })
        } finally {
            setIsFetching(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }))

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }))
    }

    const handleEditChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target

        setEditForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }))

        setEditErrors((prev) => ({
            ...prev,
            [name]: "",
        }))
    }

    const validateForm = (
        currentForm: DiscountCodeForm,
        setCurrentErrors: React.Dispatch<
            React.SetStateAction<{
                code: string
                discount_value: string
                start_date: string
                end_date: string
                usage_limit: string
            }>
        >
    ) => {
        const newErrors = {
            code: "",
            discount_value: "",
            start_date: "",
            end_date: "",
            usage_limit: "",
        }

        let valid = true

        if (!currentForm.code.trim()) {
            newErrors.code = "Discount code is required"
            valid = false
        }

        if (!currentForm.discount_value) {
            newErrors.discount_value =
                "Discount value is required"
            valid = false
        } else {
            const discountValue = Number(
                currentForm.discount_value
            )

            if (
                Number.isNaN(discountValue) ||
                discountValue < 0
            ) {
                newErrors.discount_value =
                    "Discount value must be valid"
                valid = false
            }

            if (
                currentForm.discount_type === "PERCENTAGE" &&
                discountValue > 100
            ) {
                newErrors.discount_value =
                    "Percentage cannot be greater than 100"
                valid = false
            }
        }

        if (!currentForm.start_date) {
            newErrors.start_date =
                "Start date is required"
            valid = false
        }

        if (!currentForm.end_date) {
            newErrors.end_date =
                "End date is required"
            valid = false
        }

        if (
            currentForm.start_date &&
            currentForm.end_date &&
            new Date(currentForm.start_date) >=
            new Date(currentForm.end_date)
        ) {
            newErrors.end_date =
                "End date must be later than start date"
            valid = false
        }

        if (currentForm.usage_limit) {
            const usageLimit = Number(
                currentForm.usage_limit
            )

            if (
                Number.isNaN(usageLimit) ||
                usageLimit < 1
            ) {
                newErrors.usage_limit =
                    "Usage limit must be at least 1"
                valid = false
            }
        }

        setCurrentErrors(newErrors)

        return valid
    }

    const resetForm = () => {
        setForm(initialForm)

        setErrors({
            code: "",
            discount_value: "",
            start_date: "",
            end_date: "",
            usage_limit: "",
        })
    }

    const toJakartaISOString = (dateTimeLocal: string) => {
        if (!dateTimeLocal) {
            return ""
        }

        return new Date(
            `${dateTimeLocal}:00+07:00`
        ).toISOString()
    }

    const buildPayload = (
        currentForm: DiscountCodeForm
    ) => {
        return {
            code: currentForm.code
                .trim()
                .toUpperCase(),

            discount_type:
                currentForm.discount_type,

            discount_value: Number(
                currentForm.discount_value
            ),

            start_date: toJakartaISOString(
                currentForm.start_date
            ),

            end_date: toJakartaISOString(
                currentForm.end_date
            ),

            usage_limit: currentForm.usage_limit
                ? Number(currentForm.usage_limit)
                : null,

            is_active: currentForm.is_active,
        }
    }

    const getTeamLeaderById = (
        idTeamLeader: number
    ) => {
        return teamLeaders.find(
            (teamLeader) =>
                Number(teamLeader.id_team_leader) ===
                Number(idTeamLeader)
        )
    }

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }
        ).format(amount)
    }

    // CREATE
    const handleCreate = async (
        e: React.FormEvent
    ) => {
        e.preventDefault()

        if (!validateForm(form, setErrors)) return

        try {
            setIsCreating(true)

            const token =
                sessionStorage.getItem("token")

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/createDiscountCode`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                        buildPayload(form)
                    ),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setToast({
                    message:
                        data.message ||
                        "Failed to create discount code",
                    type: "error",
                })

                return
            }

            setToast({
                message:
                    data.message ||
                    "Discount code created successfully",
                type: "success",
            })

            resetForm()
            fetchDiscountCodes()
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    "Something went wrong. Please try again.",
                type: "error",
            })
        } finally {
            setIsCreating(false)
        }
    }

    // OPEN EDIT MODAL
    const openEditModal = (
        discount: DiscountCode
    ) => {
        setSelectedDiscount(discount)

        setEditForm({
            code: discount.code,

            discount_type:
                discount.discount_type,

            discount_value: String(
                discount.discount_value
            ),

            start_date: toDateTimeLocal(
                discount.start_date
            ),

            end_date: toDateTimeLocal(
                discount.end_date
            ),

            usage_limit:
                discount.usage_limit === null
                    ? ""
                    : String(discount.usage_limit),

            is_active: discount.is_active,
        })

        setEditErrors({
            code: "",
            discount_value: "",
            start_date: "",
            end_date: "",
            usage_limit: "",
        })

        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
        setSelectedDiscount(null)
        setEditForm(initialForm)
    }

    // UPDATE
    const handleUpdate = async (
        e: React.FormEvent
    ) => {
        e.preventDefault()

        if (!selectedDiscount) return

        if (
            !validateForm(
                editForm,
                setEditErrors
            )
        ) {
            return
        }

        try {
            setIsUpdating(true)

            const token =
                sessionStorage.getItem("token")

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateDiscountCode/${selectedDiscount._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                        buildPayload(editForm)
                    ),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setToast({
                    message:
                        data.message ||
                        "Failed to update discount code",
                    type: "error",
                })

                return
            }

            setToast({
                message:
                    data.message ||
                    "Discount code updated successfully",
                type: "success",
            })

            closeEditModal()
            fetchDiscountCodes()
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    "Something went wrong while updating discount code",
                type: "error",
            })
        } finally {
            setIsUpdating(false)
        }
    }

    // REDEEMED TEAM LEADER MODAL
    const openRedeemedModal = (
        discount: DiscountCode
    ) => {
        setSelectedDiscount(discount)
        setIsRedeemedModalOpen(true)
    }

    const closeRedeemedModal = () => {
        setIsRedeemedModalOpen(false)
        setSelectedDiscount(null)
    }

    // DELETE MODAL
    const openDeleteModal = (
        discount: DiscountCode
    ) => {
        setDiscountToDelete(discount)
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setDiscountToDelete(null)
    }

    // DELETE
    const handleDelete = async () => {
        if (!discountToDelete) return

        try {
            setIsDeleting(true)

            const token =
                sessionStorage.getItem("token")

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/deleteDiscountCode/${discountToDelete._id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setToast({
                    message:
                        data.message ||
                        "Failed to delete discount code",
                    type: "error",
                })

                return
            }

            setToast({
                message:
                    data.message ||
                    "Discount code deleted successfully",
                type: "success",
            })

            closeDeleteModal()
            fetchDiscountCodes()
        } catch (error) {
            console.error(error)

            setToast({
                message:
                    "Something went wrong while deleting discount code",
                type: "error",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone: "Asia/Jakarta",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        ).format(new Date(date))
    }

    const formatDiscount = (
        discount: DiscountCode
    ) => {
        if (
            discount.discount_type ===
            "PERCENTAGE"
        ) {
            return `${discount.discount_value}%`
        }

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }
        ).format(discount.discount_value)
    }

    const getStatus = (
        discount: DiscountCode
    ) => {
        const now = new Date()

        const startDate = new Date(
            discount.start_date
        )

        const endDate = new Date(
            discount.end_date
        )

        if (!discount.is_active) {
            return {
                label: "Inactive",
                className:
                    "bg-gray-500/15 text-gray-300",
            }
        }

        if (now < startDate) {
            return {
                label: "Upcoming",
                className:
                    "bg-yellow-500/15 text-yellow-300",
            }
        }

        if (now > endDate) {
            return {
                label: "Expired",
                className:
                    "bg-red-500/15 text-red-300",
            }
        }

        if (
            discount.usage_limit !== null &&
            discount.used_count >=
            discount.usage_limit
        ) {
            return {
                label: "Limit Reached",
                className:
                    "bg-red-500/15 text-red-300",
            }
        }

        return {
            label: "Active",
            className:
                "bg-green-500/15 text-green-300",
        }
    }

    return (
        <div className="px-10 py-7">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() =>
                        setToast(null)
                    }
                />
            )}

            <div className="text-white">
                <p className="text-2xl font-bold italic">
                    Discount Code Management
                </p>
            </div>

            {/* CREATE FORM */}
            <div className="glass mt-7 rounded-xl! px-7 py-5 text-white">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10">
                        <Plus className="text-cyan-300" />
                    </div>

                    <div>
                        <p className="font-garamond text-2xl font-semibold underline">
                            Generate Discount Code
                        </p>

                        <p className="mt-1 text-sm text-gray-300">
                            Create a new discount code
                            for competition registration.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleCreate}
                    className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                    <DiscountFormFields
                        form={form}
                        errors={errors}
                        handleChange={handleChange}
                        setForm={setForm}
                        setErrors={setErrors}
                    />

                    <div className="mt-3 flex justify-end gap-3 md:col-span-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="glass cursor-pointer rounded-xl px-5 py-3"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="glass cursor-pointer rounded-xl px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCreating
                                ? "Generating..."
                                : "Generate Code"}
                        </button>
                    </div>
                </form>
            </div>

            {/* TABLE */}
            <div className="glass mt-7 rounded-xl! px-7 py-5 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10">
                            <BadgePercent className="text-cyan-300" />
                        </div>

                        <div>
                            <p className="font-garamond text-2xl font-semibold underline">
                                Discount Codes
                            </p>

                            <p className="mt-1 text-sm text-gray-300">
                                Manage all generated
                                discount codes.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={fetchDiscountCodes}
                        disabled={isFetching}
                        className="glass flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCcw
                            className={`h-4 w-4 ${isFetching
                                ? "animate-spin"
                                : ""
                                }`}
                        />

                        Refresh
                    </button>
                </div>

                <div className="mt-6 overflow-x-auto">
                    {isFetching ? (
                        <div className="py-10 text-center text-gray-300">
                            Loading discount codes...
                        </div>
                    ) : discountCodes.length === 0 ? (
                        <div className="py-10 text-center text-gray-400">
                            No discount codes available.
                        </div>
                    ) : (
                        <table className="w-full min-w-275 text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-300">
                                    <th className="px-4 py-3">
                                        Code
                                    </th>

                                    <th className="px-4 py-3">
                                        Type
                                    </th>

                                    <th className="px-4 py-3">
                                        Value
                                    </th>

                                    <th className="px-4 py-3">
                                        Period
                                    </th>

                                    <th className="px-4 py-3">
                                        Usage
                                    </th>

                                    <th className="px-4 py-3">
                                        Redeemed
                                    </th>

                                    <th className="px-4 py-3">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {discountCodes.map(
                                    (discount) => {
                                        const status =
                                            getStatus(
                                                discount
                                            )

                                        return (
                                            <tr
                                                key={
                                                    discount._id
                                                }
                                                className="border-b border-white/5 hover:bg-white/5"
                                            >
                                                <td className="px-4 py-4">
                                                    <span className="rounded-lg bg-cyan-500/10 px-3 py-1 font-mono font-semibold text-cyan-300">
                                                        {
                                                            discount.code
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {
                                                        discount.discount_type
                                                    }
                                                </td>

                                                <td className="px-4 py-4 font-semibold text-[#EAE0CF]">
                                                    {formatDiscount(
                                                        discount
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p>
                                                        {formatDate(
                                                            discount.start_date
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        to{" "}
                                                        {formatDate(
                                                            discount.end_date
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p className="font-medium">
                                                        {
                                                            discount.used_count
                                                        }{" "}
                                                        /{" "}
                                                        {discount.usage_limit ??
                                                            "∞"}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openRedeemedModal(
                                                                discount
                                                            )
                                                        }
                                                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2 text-purple-300 hover:bg-purple-500/20"
                                                    >
                                                        <Users className="h-4 w-4" />

                                                        {
                                                            discount
                                                                .redeemed_by
                                                                .length
                                                        }
                                                    </button>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    discount
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg bg-blue-500/10 p-2 text-blue-300 hover:bg-blue-500/20"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    discount
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditModalOpen &&
                selectedDiscount && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#7288AE]/30 bg-[#111844] p-6 text-white shadow-2xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Update Discount Code
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Update discount code{" "}
                                        <span className="font-semibold text-cyan-300">
                                            {
                                                selectedDiscount.code
                                            }
                                        </span>
                                    </p>
                                </div>

                                <button
                                    onClick={closeEditModal}
                                    className="cursor-pointer rounded-full bg-white/10 p-2 hover:bg-white/20"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleUpdate}
                                className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
                            >
                                <DiscountFormFields
                                    form={editForm}
                                    errors={editErrors}
                                    handleChange={
                                        handleEditChange
                                    }
                                    setForm={
                                        setEditForm
                                    }
                                    setErrors={
                                        setEditErrors
                                    }
                                    isEdit={true}
                                />

                                <div className="mt-3 flex justify-end gap-3 md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={
                                            closeEditModal
                                        }
                                        className="cursor-pointer rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            isUpdating
                                        }
                                        className="cursor-pointer rounded-xl bg-[#EAE0CF] px-5 py-3 font-semibold text-[#111844] disabled:opacity-60"
                                    >
                                        {isUpdating
                                            ? "Updating..."
                                            : "Update Code"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            {/* REDEEMED DETAIL MODAL */}
            {isRedeemedModalOpen &&
                selectedDiscount && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-5 backdrop-blur-sm">
                        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#7288AE]/30 bg-[#111844] p-6 text-white shadow-2xl">
                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Discount Usage Details
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Detail penggunaan discount code{" "}
                                        <span className="font-mono font-semibold text-cyan-300">
                                            {selectedDiscount.code}
                                        </span>
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeRedeemedModal}
                                    className="cursor-pointer rounded-full bg-white/10 p-2 hover:bg-white/20"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* SUMMARY */}
                            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs text-gray-400">
                                        Discount Code
                                    </p>

                                    <p className="mt-1 font-mono font-semibold text-cyan-300">
                                        {selectedDiscount.code}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs text-gray-400">
                                        Discount Value
                                    </p>

                                    <p className="mt-1 font-semibold text-[#EAE0CF]">
                                        {formatDiscount(
                                            selectedDiscount
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs text-gray-400">
                                        Used
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedDiscount.used_count}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs text-gray-400">
                                        Usage Limit
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {selectedDiscount.usage_limit ??
                                            "Unlimited"}
                                    </p>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="mt-6">
                                {selectedDiscount.redeemed_by
                                    .length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center">
                                        <Users className="mx-auto h-10 w-10 text-gray-500" />

                                        <p className="mt-3 font-medium">
                                            This discount code has not
                                            been redeemed yet.
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            Redemption details will
                                            appear here after the code
                                            is used.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedDiscount.redeemed_by.map(
                                            (
                                                redemption,
                                                index
                                            ) => {
                                                const teamLeader =
                                                    getTeamLeaderById(
                                                        redemption.id_team_leader
                                                    )

                                                return (
                                                    <div
                                                        key={`${redemption.id_registration}-${index}`}
                                                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                                    >
                                                        {/* USER */}
                                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/15 font-bold text-purple-300">
                                                                    {index +
                                                                        1}
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold text-white">
                                                                        {teamLeader?.name_team_leader ||
                                                                            `Team Leader #${redemption.id_team_leader}`}
                                                                    </p>

                                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                                        {teamLeader?.email_team_leader ||
                                                                            "Email not available"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="rounded-lg bg-cyan-500/10 px-3 py-2 text-xs text-cyan-300">
                                                                Registration #
                                                                {
                                                                    redemption.id_registration
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* TRANSACTION */}
                                                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                                                            <div className="rounded-xl bg-black/15 p-3">
                                                                <p className="text-xs text-gray-400">
                                                                    Original
                                                                    Amount
                                                                </p>

                                                                <p className="mt-1 font-semibold text-white">
                                                                    {formatRupiah(
                                                                        redemption.transaction_amount
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-xl bg-green-500/5 p-3">
                                                                <p className="text-xs text-gray-400">
                                                                    Discount
                                                                    Amount
                                                                </p>

                                                                <p className="mt-1 font-semibold text-green-300">
                                                                    -
                                                                    {formatRupiah(
                                                                        redemption.discount_amount
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-xl bg-cyan-500/5 p-3">
                                                                <p className="text-xs text-gray-400">
                                                                    Final
                                                                    Amount
                                                                </p>

                                                                <p className="mt-1 font-semibold text-cyan-300">
                                                                    {formatRupiah(
                                                                        redemption.final_amount
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* DETAIL */}
                                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-gray-400">
                                                            <div>
                                                                Team
                                                                Leader ID:{" "}
                                                                <span className="text-gray-200">
                                                                    {
                                                                        redemption.id_team_leader
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div>
                                                                Redeemed:{" "}
                                                                <span className="text-gray-200">
                                                                    {formatDate(
                                                                        redemption.redeemed_at
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* DELETE MODAL */}
            {isDeleteModalOpen &&
                discountToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#111844] p-6 text-white shadow-2xl">
                            <div className="flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                                    <TriangleAlert className="h-8 w-8 text-red-400" />
                                </div>
                            </div>

                            <div className="mt-5 text-center">
                                <h2 className="text-xl font-bold">
                                    Delete Discount Code?
                                </h2>

                                <p className="mt-2 text-sm text-gray-400">
                                    Are you sure you want
                                    to delete{" "}
                                    <span className="font-mono font-semibold text-white">
                                        {
                                            discountToDelete.code
                                        }
                                    </span>
                                    ?
                                </p>

                                <p className="mt-2 text-xs text-red-300">
                                    This action cannot be
                                    undone.
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={isDeleting}
                                    className="cursor-pointer w-full rounded-xl border border-white/20 py-3 font-semibold hover:bg-white/10"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={isDeleting}
                                    className="cursor-pointer w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                    {isDeleting
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

interface DiscountFormFieldsProps {
    form: DiscountCodeForm

    errors: {
        code: string
        discount_value: string
        start_date: string
        end_date: string
        usage_limit: string
    }

    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => void

    setForm: React.Dispatch<
        React.SetStateAction<DiscountCodeForm>
    >

    setErrors: React.Dispatch<
        React.SetStateAction<{
            code: string
            discount_value: string
            start_date: string
            end_date: string
            usage_limit: string
        }>
    >

    isEdit?: boolean
}

interface DateTime12HourInputProps {
    name: "start_date" | "end_date"
    value: string
    onChange: (value: string) => void
}

const DateTime12HourInput = ({
    value,
    onChange,
}: DateTime12HourInputProps) => {
    const parseValue = () => {
        if (!value) {
            return {
                date: "",
                hour: "12",
                minute: "00",
                period: "AM" as "AM" | "PM",
            }
        }

        const [date, time = "00:00"] =
            value.split("T")

        const [hourString, minute = "00"] =
            time.split(":")

        const hour24 = Number(hourString)

        const period: "AM" | "PM" =
            hour24 >= 12 ? "PM" : "AM"

        const hour12 =
            hour24 % 12 === 0
                ? 12
                : hour24 % 12

        return {
            date,
            hour: String(hour12),
            minute,
            period,
        }
    }

    const current = parseValue()

    const updateValue = ({
        date = current.date,
        hour = current.hour,
        minute = current.minute,
        period = current.period,
    }: {
        date?: string
        hour?: string
        minute?: string
        period?: "AM" | "PM"
    }) => {
        if (!date) {
            onChange("")
            return
        }

        let hour24 = Number(hour)

        if (period === "AM") {
            if (hour24 === 12) {
                hour24 = 0
            }
        } else {
            if (hour24 !== 12) {
                hour24 += 12
            }
        }

        const formattedHour =
            String(hour24).padStart(2, "0")

        onChange(
            `${date}T${formattedHour}:${minute}`
        )
    }

    return (
        <div className="mt-2 grid grid-cols-[1fr_auto_auto_auto] gap-2">
            {/* DATE */}
            <input
                type="date"
                value={current.date}
                onChange={(e) =>
                    updateValue({
                        date: e.target.value,
                    })
                }
                className="min-w-0 rounded-lg bg-white px-3 py-2 text-black"
            />

            {/* HOUR */}
            <select
                value={current.hour}
                onChange={(e) =>
                    updateValue({
                        hour: e.target.value,
                    })
                }
                className="rounded-lg bg-white px-3 py-2 text-black"
            >
                {Array.from(
                    { length: 12 },
                    (_, index) => index + 1
                ).map((hour) => (
                    <option
                        key={hour}
                        value={String(hour)}
                    >
                        {String(hour).padStart(
                            2,
                            "0"
                        )}
                    </option>
                ))}
            </select>

            {/* MINUTE */}
            <select
                value={current.minute}
                onChange={(e) =>
                    updateValue({
                        minute: e.target.value,
                    })
                }
                className="rounded-lg bg-white px-3 py-2 text-black"
            >
                {Array.from(
                    { length: 60 },
                    (_, index) => index
                ).map((minute) => {
                    const formattedMinute =
                        String(minute).padStart(
                            2,
                            "0"
                        )

                    return (
                        <option
                            key={minute}
                            value={
                                formattedMinute
                            }
                        >
                            {formattedMinute}
                        </option>
                    )
                })}
            </select>

            {/* AM / PM */}
            <select
                value={current.period}
                onChange={(e) =>
                    updateValue({
                        period: e.target
                            .value as
                            | "AM"
                            | "PM",
                    })
                }
                className="rounded-lg bg-white px-3 py-2 font-medium text-black"
            >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    )
}

const DiscountFormFields = ({
    form,
    errors,
    handleChange,
    setForm,
    setErrors,
    isEdit = false
}: DiscountFormFieldsProps) => {
    return (
        <>
            <div>
                <p>Code</p>

                <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={(e) => {
                        const value = e.target.value
                            .replace(/\s/g, "")
                            .toUpperCase()

                        setForm((prev) => ({
                            ...prev,
                            code: value,
                        }))

                        setErrors((prev) => ({
                            ...prev,
                            code: "",
                        }))
                    }}
                    placeholder="Example: LOMBA20"
                    className="mt-2 w-full rounded-lg bg-white px-3 py-2 uppercase text-black"
                />

                {errors.code && (
                    <p className="mt-1 text-xs italic text-red-400">
                        {errors.code}
                    </p>
                )}
            </div>

            <div>
                <p>Discount Type</p>

                <select
                    name="discount_type"
                    value={form.discount_type}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-black"
                >
                    <option value="PERCENTAGE">
                        Percentage
                    </option>

                    <option value="FIXED">
                        Fixed Amount
                    </option>
                </select>
            </div>

            <div>
                <p>Discount Value</p>

                <input
                    type="number"
                    name="discount_value"
                    value={form.discount_value}
                    onChange={handleChange}
                    min="0"
                    max={
                        form.discount_type ===
                            "PERCENTAGE"
                            ? "100"
                            : undefined
                    }
                    placeholder={
                        form.discount_type ===
                            "PERCENTAGE"
                            ? "Example: 20"
                            : "Example: 50000"
                    }
                    className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-black"
                />

                {errors.discount_value && (
                    <p className="mt-1 text-xs italic text-red-400">
                        {errors.discount_value}
                    </p>
                )}
            </div>

            <div>
                <p>Usage Limit</p>

                <input
                    type="number"
                    name="usage_limit"
                    value={form.usage_limit}
                    onChange={handleChange}
                    min="1"
                    placeholder="Leave empty for unlimited"
                    className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-black"
                />

                {errors.usage_limit && (
                    <p className="mt-1 text-xs italic text-red-400">
                        {errors.usage_limit}
                    </p>
                )}
            </div>

            <div
                className={
                    isEdit
                        ? "space-y-5 md:col-span-2"
                        : "contents"
                }
            >
                <div>
                    <p>Start Date</p>

                    <DateTime12HourInput
                        name="start_date"
                        value={form.start_date}
                        onChange={(value) => {
                            setForm((prev) => ({
                                ...prev,
                                start_date: value,
                            }))

                            setErrors((prev) => ({
                                ...prev,
                                start_date: "",
                            }))
                        }}
                    />

                    {errors.start_date && (
                        <p className="mt-1 text-xs italic text-red-400">
                            {errors.start_date}
                        </p>
                    )}
                </div>

                <div>
                    <p>End Date</p>

                    <DateTime12HourInput
                        name="end_date"
                        value={form.end_date}
                        onChange={(value) => {
                            setForm((prev) => ({
                                ...prev,
                                end_date: value,
                            }))

                            setErrors((prev) => ({
                                ...prev,
                                end_date: "",
                            }))
                        }}
                    />

                    {errors.end_date && (
                        <p className="mt-1 text-xs italic text-red-400">
                            {errors.end_date}
                        </p>
                    )}
                </div>
            </div>

            <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />

                    <span>
                        Discount code is active
                    </span>
                </label>
            </div>
        </>
    )
}

const toDateTimeLocal = (date: string) => {
    const value = new Date(date)

    const parts = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }
    ).formatToParts(value)

    const getPart = (type: string) =>
        parts.find(
            (part) => part.type === type
        )?.value ?? ""

    const year = getPart("year")
    const month = getPart("month")
    const day = getPart("day")
    const hour = getPart("hour")
    const minute = getPart("minute")

    return `${year}-${month}-${day}T${hour}:${minute}`
}

export default DiscountCodes