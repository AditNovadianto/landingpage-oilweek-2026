import { useEffect } from "react"

interface ToastProps {
    message: string
    type: "success" | "error"
    onClose: () => void
}

const Toast = ({ message, type, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-inter transition-all duration-300 animate-fade-in ${type === "success" ? "bg-[#1e3a2f] border border-[#36C2A1]" : "bg-[#3a1e1e] border border-red-400"
                }`}
        >
            <span className={type === "success" ? "text-[#36C2A1]" : "text-red-400"}>
                {type === "success" ? "✓" : "✕"}
            </span>
            <span>{message}</span>
        </div>
    )
}

export default Toast