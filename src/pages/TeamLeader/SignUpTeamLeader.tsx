import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import bgSignIn from "../../images/bg-sign-in.png"
import logo from "../../images/logo-double.png"
import logoOw from "../../images/Logo-ow.png"
import { Eye, EyeOff } from "lucide-react"
import Toast from "../../components/Toast"
import useImagePreload from "../../hooks/useImagePreload"
import Aos from "aos"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface SignUpData {
    name_team_leader: string
    major_team_leader: string
    email_team_leader: string
    password_team_leader: string
    phone_number_team_leader: string
    student_id_card: string
}

const SignUpTeamLeader = () => {
    const bgLoaded = useImagePreload(bgSignIn)
    const navigate = useNavigate()

    const [formData, setFormData] = useState<SignUpData>({
        name_team_leader: "",
        major_team_leader: "",
        email_team_leader: "",
        password_team_leader: "",
        phone_number_team_leader: "",
        student_id_card: "",
    })

    const [errors, setErrors] = useState<Partial<SignUpData>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    useEffect(() => {
        Aos.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        })
    }, [])

    const validateForm = () => {
        const newErrors: Partial<SignUpData> = {}

        if (!formData.name_team_leader.trim()) {
            newErrors.name_team_leader = "Nama wajib diisi"
        }

        if (!formData.major_team_leader.trim()) {
            newErrors.major_team_leader = "Jurusan wajib diisi"
        }

        if (!formData.email_team_leader.trim()) {
            newErrors.email_team_leader = "Email wajib diisi"
        }

        if (
            formData.email_team_leader &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_team_leader)
        ) {
            newErrors.email_team_leader = "Format email tidak valid"
        }

        if (!formData.password_team_leader.trim()) {
            newErrors.password_team_leader = "Password wajib diisi"
        }

        if (
            formData.password_team_leader &&
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(
                formData.password_team_leader
            )
        ) {
            newErrors.password_team_leader =
                "Password minimal 8 karakter dengan huruf besar, huruf kecil, dan angka"
        }

        if (!formData.phone_number_team_leader.trim()) {
            newErrors.phone_number_team_leader = "Nomor HP wajib diisi"
        }

        if (!formData.student_id_card.trim()) {
            newErrors.student_id_card = "Student ID wajib diisi"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }))
    }

    const handlePhoneChange = (phone: string) => {
        setFormData((prev) => ({
            ...prev,
            phone_number_team_leader: `+${phone}`,
        }))

        setErrors((prev) => ({
            ...prev,
            phone_number_team_leader: undefined,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setIsLoading(true)

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/signUpTeamLeader`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setToast({
                    message: data.error || data.message || "Pendaftaran gagal",
                    type: "error",
                })
                return
            }

            setToast({
                message: "Pendaftaran berhasil! Silakan login untuk melengkapi profil.",
                type: "success",
            })

            setTimeout(() => {
                navigate("/team-leader/sign-in")
            }, 2000)
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
        <div
            className="px-5 md:px-10 lg:px-20 py-10 min-h-screen bg-cover overflow-hidden flex items-center justify-center"
            style={{
                backgroundImage: bgLoaded ? `url(${bgSignIn})` : "none",
                backgroundColor: "#0d1e2e",
                transition: "background-image 0.3s ease",
            }}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Link
                to="/"
                className="hidden absolute top-10 left-10 glass w-max px-5 py-2 md:flex items-center justify-center"
                data-aos="fade-down"
            >
                <img className="w-14 cursor-pointer" src={logo} alt="Logo" />
            </Link>

            <div
                className="glass px-5 py-5 lg:px-10 lg:py-7 text-white w-full md:w-[60%] lg:w-[40%]"
                data-aos="fade-up"
            >
                <Link
                    to="/"
                    className="glass w-max px-5 py-2 flex md:hidden items-center justify-center"
                    data-aos="fade-down"
                >
                    <img className="w-14 cursor-pointer" src={logo} alt="Logo" />
                </Link>

                <img
                    className="animate-pulse w-20 m-auto"
                    src={logoOw}
                    alt="Oil Week Logo"
                    data-aos="zoom-in"
                    data-aos-delay="100"
                />

                <p
                    className="font-semibold text-xl font-inter mt-5 text-center italic"
                    data-aos="fade-up"
                    data-aos-delay="150"
                >
                    Create Your Account
                </p>

                <p
                    className="italic font-inter font-light mt-2 text-center"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    Join Oil Week and{" "}
                    <span className="font-semibold font-garamond text-[#E7C66B]">
                        #LeadtheShift
                    </span>{" "}
                    with Us
                </p>

                <p
                    className="text-xs text-white/60 text-center mt-3 italic"
                    data-aos="fade-up"
                    data-aos-delay="250"
                >
                    Please fill in your basic information. Registration files can
                    be completed later in My Profile.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="flex flex-col gap-3">
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <div>
                                <p className="text-sm mb-1">Full Name</p>

                                <input
                                    name="name_team_leader"
                                    type="text"
                                    value={formData.name_team_leader}
                                    onChange={handleChange}
                                    className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm outline-none"
                                />

                                {errors.name_team_leader && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.name_team_leader}
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm mb-1">Major</p>

                                <input
                                    name="major_team_leader"
                                    type="text"
                                    value={formData.major_team_leader}
                                    onChange={handleChange}
                                    className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm outline-none"
                                />

                                {errors.major_team_leader && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.major_team_leader}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="350">
                            <p className="text-sm mb-1">Email</p>

                            <input
                                name="email_team_leader"
                                type="email"
                                value={formData.email_team_leader}
                                onChange={handleChange}
                                className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm outline-none"
                            />

                            {errors.email_team_leader && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.email_team_leader}
                                </p>
                            )}
                        </div>

                        <div data-aos="fade-up" data-aos-delay="400">
                            <p className="text-sm mb-1">Password</p>

                            <div className="relative">
                                <input
                                    name="password_team_leader"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password_team_leader}
                                    onChange={handleChange}
                                    className="w-full rounded-lg px-3 py-2 pr-12 bg-white text-black text-sm outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black cursor-pointer"
                                >
                                    {showPassword ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeOff size={20} />
                                    )}
                                </button>
                            </div>

                            <p className="text-xs mt-1 italic font-inter font-light text-white/60">
                                Minimum 8 characters, including uppercase,
                                lowercase, and a number.
                            </p>

                            {errors.password_team_leader && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.password_team_leader}
                                </p>
                            )}
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="450"
                            className="z-10"
                        >
                            <p className="text-sm mb-1">Phone Number</p>

                            <PhoneInput
                                country="id"
                                enableSearch
                                searchPlaceholder="Search country..."
                                value={formData.phone_number_team_leader}
                                onChange={handlePhoneChange}
                                containerStyle={{
                                    width: "100%",
                                }}
                                inputStyle={{
                                    width: "100%",
                                    height: "42px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "14px",
                                    color: "#000",
                                    paddingLeft: "48px",
                                    boxSizing: "border-box",
                                }}
                                buttonStyle={{
                                    border: "none",
                                    borderRadius: "8px 0 0 8px",
                                    background: "#fff",
                                }}
                                dropdownStyle={{
                                    maxHeight: "250px",
                                    color: "#000",
                                }}
                            />

                            {errors.phone_number_team_leader && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.phone_number_team_leader}
                                </p>
                            )}
                        </div>

                        <div data-aos="fade-up" data-aos-delay="500">
                            <p className="text-sm mb-1">Student ID</p>

                            <input
                                name="student_id_card"
                                type="text"
                                value={formData.student_id_card}
                                onChange={handleChange}
                                className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm outline-none"
                            />

                            {errors.student_id_card && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.student_id_card}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full glass px-5 py-3 text-center mt-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        <p className="text-center">
                            Already have an account?{" "}
                            <Link
                                to="/team-leader/sign-in"
                                className="text-[#36C2A1]"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUpTeamLeader