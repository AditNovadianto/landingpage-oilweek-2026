import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/events/sc/bg-sc.png"
import logo from "../../images/events/sc/logo-sc.png"
import images from "../../images/events/sc/images-sc.png"
import desc from "../../images/events/sc/desc-sc.png"
import Aos from "aos"
import { useEffect } from "react"
import useImagePreload from "../../hooks/useImagePreload"

const SPECare = () => {
    const bgLoaded = useImagePreload(bg)

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            // Reset semua elemen AOS yang sudah "dipakai"
            document.querySelectorAll("[data-aos]").forEach((el) => {
                el.removeAttribute("data-aos-animate");
                el.classList.remove("aos-animate");
            });

            Aos.init({
                duration: 600,
                once: true,
                easing: "ease-in-out",
            });
            Aos.refreshHard();
        }, 300);
    }, []);

    return (
        <div className="bg-cover min-h-screen overflow-hidden" style={{ backgroundImage: bgLoaded ? `url(${bg})` : "none", backgroundColor: "#0d1e2e", transition: "background-image 0.3s ease" }}>
            <Navbar />

            <div
                data-aos="fade-up"
                className="mt-44 w-full flex flex-col items-center"
            >
                <img className="w-[90%] md:w-[35%]" src={logo} alt="" />

                <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="px-5 md:px-20 lg:px-32 mt-14"
                >
                    <p className="text-2xl text-center text-white font-inter font-light"><span className="font-semibold italic">SPECare</span> is a community service program that <span className="font-semibold italic">encourages participants to spread kindness</span>, create meaningful impact, and grow together through <span className="font-semibold italic">social and environmental activities.</span></p>
                </div>

                <div className="px-5 md:px-20 lg:px-32 mt-20 text-white">
                    <button
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className="glass cursor-pointer text-center px-7 py-3 flex items-center justify-center gap-5 text-lg font-inter font-light"
                    >
                        <p>Register Now</p>

                        <ArrowRight />
                    </button>
                </div>

                <div
                    data-aos="fade-left"
                    className="mt-20"
                >
                    <img className="md:-translate-x-37.5 -rotate-5 md:rotate-0 md:w-[90%]" src={desc} alt="" />
                </div>

                <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="px-5 md:px-20 lg:px-32 mt-32 w-full"
                >
                    <div className="w-max m-auto md:m-0">
                        <div
                            data-aos="fade-right"
                            data-aos-delay="200"
                            className="w-max glass rounded-full! px-20 py-4"
                        >
                            <p className="font-garamond italic text-4xl text-white">Objective</p>
                        </div>

                        <div className="w-full h-3 mt-5 bg-linear-to-r from-[#F6EBD2] to-[#E7C66B]"></div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row items-stretch gap-5 w-full">
                        <div
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Encourage <span className="font-semibold">social awareness and empathy</span> among participants</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Create <span className="font-semibold">meaningful contributions</span> to communities and the environment</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Strengthen <span className="font-semibold">collaboration</span> and <span className="font-semibold">togetherness</span> through <span className="font-semibold">volunteering</span> activities</p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="mt-32"
                >
                    <div className="px-5 md:px-20 lg:px-32 rotate-0 md:-rotate-6">
                        <p className="font-bold text-3xl font-inter text-white">Looking back on Last Year’s: <span className="font-semibold italic font-garamond text-[#E7C66B]">SPECare</span></p>

                        <p className="font-inter text-white text-2xl mt-5">Together, <span className="font-semibold">we shared kindness, created memories, and made meaningful impacts</span> through <span className="font-semibold">SPECare 2025</span>.
                        </p>

                        <p className="mt-10 font-garamond italic font-semibold text-white text-xl">Can’t wait to create even more unforgettable moments with you at SPECare 2026!</p>
                    </div>

                    <div
                        data-aos="zoom-in"
                        data-aos-delay="300"
                        className="scale-[1.5] mt-28 translate-x-62.5"
                    >
                        <img src={images} alt="" />
                    </div>
                </div>

                <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="w-full flex flex-col items-end px-5 md:px-20 lg:px-32 mt-20"
                >
                    <p className="text-xl font-inter text-white text-end">CP : <br />Indah Cindy Oktariyani <br />Person In Charge of Job Fair 2026 <br />+6283155585979
                    </p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Udurma Theodora Daniella Silaban <br />Co-Director of <br />Human Resources and Development 2026 <br />+6282112745158</p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Artanti Waranggani <br />Director of Human Resources and Development 2026 <br />+6285773924238
                    </p>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default SPECare