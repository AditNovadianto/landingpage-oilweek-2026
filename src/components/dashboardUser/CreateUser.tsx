import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Toast from "../../components/Toast"
import { isTokenExpired } from "../../utils/auth"

interface Role {
    id_role: number
    name_role: string
}

const CreateUser = () => {
    const navigate = useNavigate()

    const [roles, setRoles] = useState<Role[]>([])
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const [form, setForm] = useState({
        name_user: "",
        email_user: "",
        password_user: "",
        id_role: "",
    })

    const [errors, setErrors] = useState({
        name_user: "",
        email_user: "",
        password_user: "",
        id_role: "",
    })

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("team")
            localStorage.removeItem("member")

            navigate("/user/sign-in")
            return
        }

        fetchRoles()
    }, [navigate])

    const fetchRoles = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllRoles`)
            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Gagal mengambil data role",
                    type: "error",
                })
                return
            }

            setRoles(data.roles || data)
        } catch (error) {
            console.error(error)
            setToast({
                message: "Terjadi kesalahan saat mengambil role",
                type: "error",
            })
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })

        setErrors({
            ...errors,
            [e.target.name]: "",
        })
    }

    const validate = () => {
        const newErrors = {
            name_user: "",
            email_user: "",
            password_user: "",
            id_role: "",
        }

        let valid = true

        if (!form.name_user) {
            newErrors.name_user = "Nama wajib diisi"
            valid = false
        }

        if (!form.email_user) {
            newErrors.email_user = "Email wajib diisi"
            valid = false
        }

        if (!form.password_user) {
            newErrors.password_user = "Password wajib diisi"
            valid = false
        }

        if (!form.id_role) {
            newErrors.id_role = "Role wajib dipilih"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const resetForm = () => {
        setForm({
            name_user: "",
            email_user: "",
            password_user: "",
            id_role: "",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        try {
            setIsLoading(true)

            const token = sessionStorage.getItem("token")

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signUpUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name_user: form.name_user,
                    email_user: form.email_user,
                    password_user: form.password_user,
                    id_role: Number(form.id_role),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Gagal membuat akun user",
                    type: "error",
                })
                return
            }

            setToast({
                message: data.message || "Akun user berhasil dibuat",
                type: "success",
            })

            resetForm()
        } catch (error) {
            console.error(error)

            setToast({
                message: "Terjadi kesalahan, coba lagi",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="px-10 py-7">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="text-white">
                <p className="text-2xl font-bold italic">
                    Create User Account
                </p>
            </div>

            <div className="glass mt-7 px-7 py-5 rounded-xl! text-white">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                        <UserPlus className="text-cyan-300" />
                    </div>

                    <div>
                        <p className="font-semibold text-2xl font-garamond underline">
                            Add New User
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                            Create an account for admin or competition management user.
                        </p>
                    </div>
                </div>

                <form className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                    <div>
                        <p>Name</p>
                        <input
                            type="text"
                            name="name_user"
                            value={form.name_user}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                            placeholder="Enter user name"
                        />
                        {errors.name_user && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.name_user}
                            </p>
                        )}
                    </div>

                    <div>
                        <p>Email</p>
                        <input
                            type="email"
                            name="email_user"
                            value={form.email_user}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                            placeholder="Enter user email"
                        />
                        {errors.email_user && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.email_user}
                            </p>
                        )}
                    </div>

                    <div>
                        <p>Password</p>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password_user"
                                value={form.password_user}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                placeholder="Enter password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-4 text-black cursor-pointer"
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>
                        {errors.password_user && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.password_user}
                            </p>
                        )}
                    </div>

                    <div>
                        <p>Role</p>
                        <select
                            name="id_role"
                            value={form.id_role}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                        >
                            <option value="">Select Role</option>

                            {roles.map((role) => (
                                <option key={role.id_role} value={role.id_role}>
                                    {role.name_role}
                                </option>
                            ))}
                        </select>
                        {errors.id_role && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.id_role}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="glass px-5 py-3 rounded-xl cursor-pointer"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`glass px-5 py-3 rounded-xl transition-all ${isLoading
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                        >
                            {isLoading ? "Creating..." : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUser