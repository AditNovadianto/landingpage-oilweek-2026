import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import bgSignIn from "../../images/bg-sign-in.png"
import logo from "../../images/logo-double.png"
import logoOw from "../../images/Logo-ow.png"
import Toast from "../../components/Toast"
import useImagePreload from "../../hooks/useImagePreload"
import Aos from "aos"
import { Eye, EyeOff } from "lucide-react"

const SignInUser = () => {
    const bgLoaded = useImagePreload(bgSignIn)

    useEffect(() => {
        Aos.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        })
    }, [])

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const [form, setForm] = useState({
        email_user: "",
        password_user: "",
    })

    const [errors, setErrors] = useState({
        email_user: "",
        password_user: "",
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
            email_user: "",
            password_user: "",
        }

        let valid = true

        if (!form.email_user) {
            newErrors.email_user = "Email wajib diisi"
            valid = false
        }

        if (!form.password_user) {
            newErrors.password_user = "Password wajib diisi"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const getNavigatePathByRole = (roleName: string) => {
        const normalizedRole = roleName.toUpperCase()

        if (normalizedRole === "ADMIN") {
            return "/user/dashboard-user"
        }

        if (normalizedRole.includes("BUSINESS CASE")) {
            return "/user/dashboard-admin-business-case"
        }

        if (normalizedRole.includes("PETROSMART")) {
            return "/user/dashboard-admin-petrosmart"
        }

        if (normalizedRole.includes("PAPER") || normalizedRole.includes("POSTER")) {
            return "/user/dashboard-admin-paper-poster"
        }

        if (normalizedRole.includes("MUD INNOVATION")) {
            return "/user/dashboard-admin-mud-innovation"
        }

        if (normalizedRole.includes("WELL STIMULATION")) {
            return "/user/dashboard-admin-well-stimulation"
        }

        if (normalizedRole.includes("CASE STUDY")) {
            return "/user/dashboard-admin-case-study"
        }

        return "/user/dashboard-user"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/signInUser`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            )

            const data = await res.json()

            console.log("data: ", data)

            if (!res.ok) {
                setToast({
                    message: data.error || "Sign in gagal",
                    type: "error",
                })
                return
            }

            sessionStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            const roleRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getRoleById/${data.user.id_role}`)
            const roleData = await roleRes.json()

            const roles = roleData.roles[0]

            const navigatePath = getNavigatePathByRole(roles?.name_role || "")

            setToast({
                message: `Welcome back, ${data.user.name_user}! 👋`,
                type: "success",
            })

            setTimeout(() => {
                navigate(navigatePath)
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

            <div className="glass px-5 py-5 lg:px-10 lg:py-7 text-white w-full md:w-[60%] lg:w-[40%]" data-aos="fade-up">
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
                    data-aos="zoom-in" data-aos-delay="100"
                />

                <p className="font-semibold text-xl font-inter mt-5 text-center italic" data-aos="fade-up" data-aos-delay="150">
                    Sign In User
                </p>

                <form className="mt-5" onSubmit={handleSubmit}>
                    <div data-aos="fade-up" data-aos-delay="200">
                        <p>Email</p>

                        <input
                            type="email"
                            name="email_user"
                            value={form.email_user}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                            placeholder="Enter your Email"
                        />

                        {errors.email_user && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.email_user}
                            </p>
                        )}
                    </div>

                    <div className="mt-3" data-aos="fade-up" data-aos-delay="250">
                        <p>Password</p>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password_user"
                                value={form.password_user}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                placeholder="Enter your Password"
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

                        {errors.password_user && (
                            <p className="text-red-400 text-xs mt-1 italic">
                                {errors.password_user}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link to={'/user/forgot-password'} className="underline text-base mt-5" data-aos="fade-up" data-aos-delay="300">Forgot your password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full glass px-5 py-3 text-center mt-5 transition-all ${isLoading
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer"
                            }`}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>

                    <p className="mt-5 text-center">
                        Team Leader?{" "}
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

export default SignInUser