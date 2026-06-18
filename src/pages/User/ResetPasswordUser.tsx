import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import bgSignIn from "../../images/bg-sign-in.png"
import logo from "../../images/logo-double.png"
import logoOw from "../../images/Logo-ow.png"
import Toast from "../../components/Toast"
import useImagePreload from "../../hooks/useImagePreload"
import Aos from "aos"
import { Eye, EyeOff } from "lucide-react"

const ResetPasswordUser = () => {
    const bgLoaded = useImagePreload(bgSignIn)

    useEffect(() => {
        Aos.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        })
    }, [])

    const navigate = useNavigate()
    const { token } = useParams()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [form, setForm] = useState({
        new_password: "",
        confirm_password: "",
    })

    const [errors, setErrors] = useState({
        new_password: "",
        confirm_password: "",
    })

    const [isLoading, setIsLoading] = useState(false)

    const [toast, setToast] = useState<{
        message: string
        type: "success" | "error"
    } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            new_password: "",
            confirm_password: "",
        }

        let valid = true

        if (!form.new_password) {
            newErrors.new_password = "Password baru wajib diisi"
            valid = false
        }

        if (!form.confirm_password) {
            newErrors.confirm_password = "Konfirmasi password wajib diisi"
            valid = false
        }

        if (
            form.new_password &&
            form.confirm_password &&
            form.new_password !== form.confirm_password
        ) {
            newErrors.confirm_password = "Konfirmasi password tidak sama"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/user/reset-password/${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        new_password: form.new_password,
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message: data.error || "Gagal reset password",
                    type: "error",
                })
                return
            }

            setToast({
                message: data.message || "Password berhasil direset",
                type: "success",
            })

            setTimeout(() => {
                navigate("/user/sign-in")
            }, 1500)
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
                <img className="w-14 cursor-pointer" src={logo} alt="" />
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
                    <img className="w-14 cursor-pointer" src={logo} alt="" />
                </Link>

                <img
                    className="animate-pulse w-20 m-auto"
                    src={logoOw}
                    alt=""
                    data-aos="zoom-in"
                    data-aos-delay="100"
                />

                <p
                    className="font-semibold text-xl font-inter mt-5 text-center italic"
                    data-aos="fade-up"
                    data-aos-delay="150"
                >
                    Reset Password User
                </p>

                <p
                    className="text-center text-sm mt-3 opacity-80"
                    data-aos="fade-up"
                    data-aos-delay="180"
                >
                    Enter your new password to continue signing in.
                </p>

                <form className="mt-5" onSubmit={handleSubmit}>
                    <div data-aos="fade-up" data-aos-delay="200">
                        <p>New Password</p>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="new_password"
                                value={form.new_password}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                placeholder="Enter your New Password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-5 top-4 text-black cursor-pointer"
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {errors.new_password && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.new_password}
                            </p>
                        )}
                    </div>

                    <div className="mt-3" data-aos="fade-up" data-aos-delay="250">
                        <p>Confirm Password</p>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                value={form.confirm_password}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                placeholder="Confirm your New Password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-5 top-4 text-black cursor-pointer"
                            >
                                {showConfirmPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {errors.confirm_password && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.confirm_password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full glass px-5 py-3 text-center mt-5 transition-all ${isLoading
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                    >
                        {isLoading ? "Resetting Password..." : "Reset Password"}
                    </button>

                    <p
                        className="mt-5 text-center"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        Back to{" "}
                        <Link
                            to="/user/sign-in"
                            className="text-[#36C2A1]"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordUser