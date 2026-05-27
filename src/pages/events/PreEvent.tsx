import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/events/pe/bg-pe.png"
import logo from "../../images/events/pe/logo-pe.png"
import images from "../../images/events/pe/images-pe.png"
import desc from "../../images/events/pe/desc-pe.png"
import Aos from "aos"
import { useEffect } from "react"
import useImagePreload from "../../hooks/useImagePreload"

const PreEvent = () => {
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
                    <p className="text-2xl text-center text-white font-inter font-light">Oil on Court: Kick-off <span className="font-semibold">Oil Week 2026</span> is a <span className="font-semibold italic">pre-event</span> initiative of <span className="font-garamond text-[#F8BB46]">Oil Week 2026</span> held through a fun padel match and breakfast session to encourage networking and build meaningful relations.</p>
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
                            <p className="text-xl text-white font-inter">To <span className="font-semibold">build enthusiasm</span> and engagement for Oil Week 2026.</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">To <span className="font-semibold">strengthen connections</span> between SPE UI members and ILUNI GPTK.</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">To create <span className="font-semibold">networking opportunities</span> within the energy sector.</p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="mt-32"
                >
                    <div className="px-5 md:px-20 lg:px-32 rotate-0 md:-rotate-6">
                        <p className="font-bold text-3xl font-inter text-white">Looking back on <br />Last Year's <span className="font-semibold italic font-garamond text-[#E7C66B]">Pre Event</span></p>

                        <p className="font-garamond text-white italic text-2xl mt-5">The court awaits, and so do new connections — see you at Oil on Court 2026!</p>
                    </div>

                    <div
                        data-aos="zoom-in"
                        data-aos-delay="300"
                        className="scale-[1.25] mt-20"
                    >
                        <img src={images} alt="" />
                    </div>
                </div>

                <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="w-full flex flex-col items-end px-5 md:px-20 lg:px-32 mt-20"
                >
                    <p className="text-xl font-inter text-white text-end">PIC: <br />Anindya Zhafira (+62 813 1600 3178)</p>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default PreEvent