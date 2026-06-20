import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import bgSignIn from "../../images/bg-sign-in.png"
import logo from "../../images/logo-double.png"
import logoOw from "../../images/Logo-ow.png"
import Toast from "../../components/Toast" // sesuaikan path
import useImagePreload from "../../hooks/useImagePreload"
import Aos from "aos"
import { Eye, EyeOff } from "lucide-react"

const SignIn = () => {
    const bgLoaded = useImagePreload(bgSignIn)

    useEffect(() => {
        Aos.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        });
    }, []);

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const [form, setForm] = useState({
        email_team_leader: "",
        password_team_leader: "",
    })

    const [errors, setErrors] = useState({
        email_team_leader: "",
        password_team_leader: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: "" })
    }

    const validate = () => {
        const newErrors = { email_team_leader: "", password_team_leader: "" }
        let valid = true

        if (!form.email_team_leader) {
            newErrors.email_team_leader = "Email wajib diisi"
            valid = false
        }
        if (!form.password_team_leader) {
            newErrors.password_team_leader = "Password wajib diisi"
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

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signInTeamLeader`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                setToast({ message: data.error || "Sign in gagal", type: "error" })
                return
            }

            sessionStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("team", JSON.stringify(data.team))
            localStorage.setItem("member", JSON.stringify(data.member))

            setToast({ message: `Welcome back, ${data.user.name_team_leader}! 👋`, type: "success" })

            setTimeout(() => navigate("/team-leader/dashboard-team-leader"), 2000)
        } catch (err) {
            setToast({ message: "Terjadi kesalahan, coba lagi", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="px-5 md:px-10 lg:px-20 py-10 min-h-screen bg-cover overflow-hidden flex items-center justify-center" style={{ backgroundImage: bgLoaded ? `url(${bgSignIn})` : "none", backgroundColor: "#0d1e2e", transition: "background-image 0.3s ease" }}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Link to={'/'} className="hidden absolute top-10 left-10 glass w-max px-5 py-2 md:flex items-center justify-center" data-aos="fade-down">
                <img className="w-14 cursor-pointer" src={logo} alt="" />
            </Link>

            <div className="glass px-5 py-5 lg:px-10 lg:py-7 text-white w-full md:w-[60%] lg:w-[40%]" data-aos="fade-up">
                <Link to={'/'} className="glass w-max px-5 py-2 flex md:hidden items-center justify-center" data-aos="fade-down">
                    <img className="w-14 cursor-pointer" src={logo} alt="" />
                </Link>

                <img className="animate-pulse w-20 m-auto" src={logoOw} alt="" data-aos="zoom-in" data-aos-delay="100" />

                <p className="font-semibold text-xl font-inter mt-5 text-center italic" data-aos="fade-up" data-aos-delay="150">Sign In to Oil Week</p>

                <form className="mt-5" onSubmit={handleSubmit}>
                    <div data-aos="fade-up" data-aos-delay="200">
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
                            <p className="text-red-400 text-xs mt-1 italic">{errors.email_team_leader}</p>
                        )}
                    </div>

                    <div className="mt-3" data-aos="fade-up" data-aos-delay="250">
                        <p>Password</p>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password_team_leader"
                                value={form.password_team_leader}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-lg px-3 py-2 bg-white text-black"
                                placeholder="Enter your Password"
                            />

                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-black cursor-pointer">{showPassword ? <Eye /> : <EyeOff />}</button>
                        </div>
                        {errors.password_team_leader && (
                            <p className="text-red-400 text-xs mt-1 italic">{errors.password_team_leader}</p>
                        )}

                        <p className="text-xs mt-2 italic font-inter font-light">must be at least 8 characters with uppercase, lowercase, and number</p>
                    </div>

                    <div className="flex justify-end">
                        <Link to={'/team-leader/forgot-password'} className="underline text-base mt-5" data-aos="fade-up" data-aos-delay="300">Forgot your password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full glass px-5 py-3 text-center mt-5 transition-all ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : "Sign In"}
                    </button>

                    <p className="mt-5 text-center" data-aos="fade-up" data-aos-delay="400">Don't have an account? <Link to={'/team-leader/sign-up'} className="text-[#36C2A1]">Sign Up</Link></p>
                </form>
            </div>
        </div>
    )
}

export default SignIn