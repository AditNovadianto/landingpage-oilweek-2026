import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import bgSignIn from "../../images/bg-sign-in.png"
import logo from "../../images/logo-double.png"
import logoOw from "../../images/Logo-ow.png"
import { Check } from "lucide-react"
import Toast from "../../components/Toast"
import useImagePreload from "../../hooks/useImagePreload"
import Aos from "aos"

interface Step1Data {
    name_team_leader: string
    major_team_leader: string
    email_team_leader: string
    password_team_leader: string
    phone_number_team_leader: string
    student_id_card: string
}

interface Step2Data {
    twibbon: File | null
    following_instagram: File | null
    following_linkedin: File | null
    following_tiktok: File | null
    instagram_story: File | null
    repost_competition_instagram: File | null
}

const SignUpTeamLeader = () => {
    const bgLoaded = useImagePreload(bgSignIn)

    useEffect(() => {
        Aos.init({
            duration: 1200,
            once: true,
            easing: "ease-in-out",
        });
    }, []);

    const [step, setStep] = useState<1 | 2>(1)

    const [step1, setStep1] = useState<Step1Data>({
        name_team_leader: "",
        major_team_leader: "",
        email_team_leader: "",
        password_team_leader: "",
        phone_number_team_leader: "",
        student_id_card: "",
    })

    const [step2, setStep2] = useState<Step2Data>({
        twibbon: null,
        following_instagram: null,
        following_linkedin: null,
        following_tiktok: null,
        instagram_story: null,
        repost_competition_instagram: null,
    })

    const [errors, setErrors] = useState<Partial<Step1Data>>({})

    const [isLoading, setIsLoading] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const navigate = useNavigate()

    const validateStep1 = () => {
        const newErrors: Partial<Step1Data> = {}
        if (!step1.name_team_leader) newErrors.name_team_leader = "Nama wajib diisi"
        if (!step1.major_team_leader) newErrors.major_team_leader = "Jurusan wajib diisi"
        if (!step1.email_team_leader) newErrors.email_team_leader = "Email wajib diisi"
        if (!step1.password_team_leader || step1.password_team_leader.length < 8)
            newErrors.password_team_leader = "Password minimal 8 karakter dengan huruf besar, kecil, dan angka"
        if (!step1.phone_number_team_leader) newErrors.phone_number_team_leader = "Nomor HP wajib diisi"
        if (!step1.student_id_card) newErrors.student_id_card = "NIM wajib diisi"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStep1({ ...step1, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: undefined })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setStep2({ ...step2, [e.target.name]: file })
    }

    const handleNext = () => {
        if (validateStep1()) setStep(2)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()

        Object.entries(step1).forEach(([key, val]) => formData.append(key, val))

        Object.entries(step2).forEach(([key, val]) => {
            if (val) formData.append(key, val)
        })

        try {
            setIsLoading(true)

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signUpTeamLeader`, {
                method: "POST",
                body: formData,
            })


            const data = await response.json()

            if (!response.ok) {
                setToast({ message: data.error || "Pendaftaran gagal", type: "error" })
                return
            }

            console.log("Registration successful", data)

            sessionStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            setToast({ message: "Pendaftaran berhasil! Selamat datang 🎉", type: "success" })

            setTimeout(() => navigate("/dashboard-team-leader"), 2000)
        } catch (error) {
            setToast({ message: "Terjadi kesalahan, coba lagi", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const fileFields: { name: keyof Step2Data; label: string }[] = [
        { name: "twibbon", label: "Twibbon" },
        { name: "following_instagram", label: "Bukti Follow Instagram" },
        { name: "following_linkedin", label: "Bukti Follow LinkedIn" },
        { name: "following_tiktok", label: "Bukti Follow TikTok" },
        { name: "instagram_story", label: "Instagram Story" },
        { name: "repost_competition_instagram", label: "Repost Kompetisi Instagram" },
    ]

    return (
        <div
            className="px-5 md:px-10 lg:px-20 py-10 min-h-screen bg-cover overflow-hidden flex items-center justify-center"
            style={{ backgroundImage: bgLoaded ? `url(${bgSignIn})` : "none", backgroundColor: "#0d1e2e", transition: "background-image 0.3s ease" }}
        >
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

                <p className="font-semibold text-xl font-inter mt-5 text-center italic" data-aos="fade-up" data-aos-delay="150">Create Your Account</p>

                <p className="italic font-inter font-light mt-2 text-center" data-aos="fade-up" data-aos-delay="200">
                    Join Oil Week and <span className="font-semibold font-garamond text-[#E7C66B]">Lead the Shift with Us</span>
                </p>

                {/* Step Indicator */}
                <div className="flex flex-col items-center justify-center gap-2 mt-5 mb-6" data-aos="fade-up" data-aos-delay="250">
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${step === 1
                                ? "bg-[#E7C66B] border-[#E7C66B] text-black"
                                : "bg-[#E7C66B]/30 border-[#E7C66B] text-[#E7C66B]"
                                }`}
                        >
                            {step === 2 ? <Check /> : "1"}
                        </div>

                        <div className={`h-0.5 w-20 rounded transition-all duration-300 ${step === 2 ? "bg-[#E7C66B]" : "bg-white/20"}`}></div>

                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${step === 2
                                ? "bg-[#E7C66B] border-[#E7C66B] text-black"
                                : "border-white/30 text-white/40"
                                }`}
                        >
                            2
                        </div>
                    </div>

                    <span className="block text-xs text-white/50 ml-1">
                        {step === 1 ? "Personal Info" : "Upload Dokumen"}
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ── STEP 1 ── */}
                    {step === 1 && (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3" data-aos="fade-up" data-aos-delay="300">
                                <div>
                                    <p className="text-sm mb-1">Nama Lengkap</p>

                                    <input
                                        name="name_team_leader"
                                        type="text"
                                        value={step1.name_team_leader}
                                        onChange={handleStep1Change}
                                        className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm"
                                        placeholder="John Doe"
                                    />

                                    {errors.name_team_leader && (
                                        <p className="text-red-400 text-xs mt-1">{errors.name_team_leader}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm mb-1">Jurusan</p>

                                    <input
                                        name="major_team_leader"
                                        type="text"
                                        value={step1.major_team_leader}
                                        onChange={handleStep1Change}
                                        className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm"
                                        placeholder="Informatika"
                                    />

                                    {errors.major_team_leader && (
                                        <p className="text-red-400 text-xs mt-1">{errors.major_team_leader}</p>
                                    )}
                                </div>
                            </div>

                            <div data-aos="fade-up" data-aos-delay="350">
                                <p className="text-sm mb-1">Email</p>

                                <input
                                    name="email_team_leader"
                                    type="email"
                                    value={step1.email_team_leader}
                                    onChange={handleStep1Change}
                                    className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm"
                                    placeholder="johndoe@gmail.com"
                                />

                                {errors.email_team_leader && (
                                    <p className="text-red-400 text-xs mt-1">{errors.email_team_leader}</p>
                                )}
                            </div>

                            <div data-aos="fade-up" data-aos-delay="400">
                                <p className="text-sm mb-1">Password</p>

                                <input
                                    name="password_team_leader"
                                    type="password"
                                    value={step1.password_team_leader}
                                    onChange={handleStep1Change}
                                    className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm"
                                    placeholder="Masukkan password"
                                />

                                <p className="text-xs mt-1 italic font-inter font-light text-white/60">
                                    Min. 8 karakter dengan huruf besar, kecil, dan angka
                                </p>

                                {errors.password_team_leader && (
                                    <p className="text-red-400 text-xs mt-1">{errors.password_team_leader}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3" data-aos="fade-up" data-aos-delay="450">
                                <div>
                                    <p className="text-sm mb-1">No. HP</p>

                                    <input
                                        name="phone_number_team_leader"
                                        type="tel"
                                        value={step1.phone_number_team_leader}
                                        onChange={handleStep1Change}
                                        className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm"
                                        placeholder="0812xxxxxx"
                                    />

                                    {errors.phone_number_team_leader && (
                                        <p className="text-red-400 text-xs mt-1">{errors.phone_number_team_leader}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm mb-1">NIM / Student ID</p>

                                    <input
                                        name="student_id_card"
                                        type="text"
                                        value={step1.student_id_card}
                                        onChange={handleStep1Change}
                                        className="w-full rounded-lg px-3 py-2 bg-white text-black text-sm"
                                        placeholder="12322012904"
                                    />

                                    {errors.student_id_card && (
                                        <p className="text-red-400 text-xs mt-1">{errors.student_id_card}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full glass px-5 py-3 text-center mt-2 cursor-pointer"
                            >
                                Next →
                            </button>

                            <p className="text-center text-sm">
                                Sudah punya akun?{" "}

                                <Link to="/sign-in" className="text-[#36C2A1]">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* ── STEP 2 ── */}
                    {step === 2 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-white/60 italic -mt-2" data-aos="fade-up">
                                Upload semua file sebagai bukti kelengkapan pendaftaran.
                            </p>

                            {fileFields.map(({ name, label }, index) => (
                                <div key={name} data-aos="fade-up" data-aos-delay={index * 50}>
                                    <p className="text-sm mb-1">{label} <span className="text-red-400">*</span></p>

                                    <label className="flex items-center gap-2 bg-white/10 border border-dashed border-white/40 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition text-sm">
                                        <span className="text-white/70 truncate">
                                            {step2[name] ? (step2[name] as File).name : "Pilih file..."}
                                        </span>

                                        <input
                                            type="file"
                                            name={name}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="glass px-5 py-3 text-center cursor-pointer text-white/70 hover:text-white"
                                >
                                    ← Back
                                </button>

                                <button type="submit" className="glass px-5 py-3 text-center cursor-pointer">
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Mendaftar...
                                        </span>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default SignUpTeamLeader