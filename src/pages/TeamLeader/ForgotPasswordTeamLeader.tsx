import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import bgSignIn from "../../images/bg-sign-in.png"
import logo from "../../images/logo-double.png"
import logoOw from "../../images/Logo-ow.png"
import Toast from "../../components/Toast"
import useImagePreload from "../../hooks/useImagePreload"
import Aos from "aos"

const ForgotPasswordTeamLeader = () => {
    const bgLoaded = useImagePreload(bgSignIn)

    useEffect(() => {
        Aos.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        })
    }, [])

    const [form, setForm] = useState({
        email_team_leader: "",
    })

    const [errors, setErrors] = useState({
        email_team_leader: "",
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
            email_team_leader: "",
        }

        let valid = true

        if (!form.email_team_leader) {
            newErrors.email_team_leader = "Email wajib diisi"
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
                `${import.meta.env.VITE_API_BASE_URL}/team-leader/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setToast({
                    message:
                        data.error ||
                        "Gagal mengirim link reset password",
                    type: "error",
                })
                return
            }

            setToast({
                message:
                    data.message ||
                    "Reset password link has been sent to your email",
                type: "success",
            })

            setForm({
                email_team_leader: "",
            })
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
                >
                    <img className="w-14 cursor-pointer" src={logo} alt="" />
                </Link>

                <img
                    className="animate-pulse w-20 m-auto"
                    src={logoOw}
                    alt=""
                />

                <p className="font-semibold text-xl font-inter mt-5 text-center italic">
                    Forgot Password Team Leader
                </p>

                <p className="text-center text-sm mt-3 opacity-80">
                    Enter your registered email to receive a reset password
                    link.
                </p>

                <form className="mt-5" onSubmit={handleSubmit}>
                    <div>
                        <p>Email</p>

                        <input
                            type="email"
                            name="email_team_leader"
                            value={form.email_team_leader}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                            placeholder="Enter your Email"
                        />

                        {errors.email_team_leader && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.email_team_leader}
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
                        {isLoading
                            ? "Sending Link..."
                            : "Send Reset Link"}
                    </button>

                    <p className="mt-5 text-center">
                        Remember your password?{" "}
                        <Link
                            to="/team-leader/sign-in"
                            className="text-[#36C2A1]"
                        >
                            Sign In Here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default ForgotPasswordTeamLeader