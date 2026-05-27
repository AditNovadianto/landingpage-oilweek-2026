import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/competitions/csc/bg-csc.png"
import logo from "../../images/competitions/csc/logo-csc.png"
import timeline from "../../images/competitions/csc/timeline-csc.png"
import Aos from "aos";
import { useEffect } from "react";
import useImagePreload from "../../hooks/useImagePreload"

const CaseStudyCompetition = () => {
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
                <div
                    data-aos="zoom-in"
                    data-aos-delay="100"
                    className="px-5 md:px-20 lg:px-32 relative inline-block m-auto"
                >
                    <h1 className="text-6xl text-center font-semibold italic font-garamond text-white">
                        Business Case
                    </h1>

                    <div className="h-1.5 w-full bg-linear-to-r from-[#E7C66B] to-[#F6EBD2]"></div>
                </div>

                <p
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="px-5 md:px-20 lg:px-32 text-6xl font-light text-white font-inter mt-2"
                >
                    Competition
                </p>

                <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="px-5 md:px-20 lg:px-32 mt-14"
                >
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Feasibility of Natural Hydrogen Development in Indonesia’s Upstream Energy Sector</i></p>
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

                <div className="px-5 md:px-20 lg:px-32 flex flex-col md:flex-row items-center justify-center gap-10 mt-20">
                    <img
                        data-aos="fade-right"
                        className="w-[70%] md:w-[50%] m-auto md:m-0 px-0 md:px-20 py-20"
                        src={logo}
                        alt=""
                    />

                    <div
                        data-aos="fade-left"
                        className="flex flex-col items-end"
                    >
                        <div className="glass px-5 py-7 text-white">
                            <p className="text-2xl font-garamond font-semibold">About <i>Case Study Competition</i></p>

                            <p>The Case Study Competition is a <span className="font-semibold italic">new competition</span> in Oil Week 2026 that challenges participants to solve a <span className="font-garamond italic text-[#E7C66B]">real industry-based problem through an integrated and strategic approach</span>. In this competition, participants will act as engineering consultants to <span className="font-semibold">evaluate the feasibility and development strategy of geologic hydrogen resources in Indonesia</span> by combining technical assessment, economic viability, development planning, and ESG considerations into one comprehensive recommendation for supporting the low-carbon energy transition.</p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="scale-[1.05] mt-20 md:mt-0"
                >
                    <img src={timeline} alt="" />
                </div>

                <div className="text-white mt-40 font-garamond">
                    <div
                        data-aos="fade-up"
                        className="px-5 md:px-20 lg:px-32"
                    >
                        <div className="m-auto md:w-max glass px-10 py-4 rounded-full!">
                            <p className="text-center font-light text-2xl">Frequently Asked Question <span className="text-[#E7C66B] italic">FAQ</span></p>
                        </div>
                    </div>

                    <div className="px-5 md:px-20 lg:px-32 mt-10 flex flex-col md:flex-row items-stretch gap-10">
                        <div
                            data-aos="fade-right"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Who can participate in the Case Study Competition?</p>

                            <p className="font-inter font-light mt-5">Teams that meet the competition requirements listed in the guidebook may participate. Please review the eligibility, team composition, and registration sections before signing up.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">What makes Case Study Competition different from Paper and Poster Competition?</p>

                            <p className="font-inter font-light mt-5">The Case Study Competition challenges participants to solve complex industrial problems through integrated analysis, covering technical & economic feasibility, development strategy, risk analysis, and sustainability impact.</p>
                        </div>
                    </div>

                    <div className="px-5 md:px-20 lg:px-32 mt-10 flex flex-col md:flex-row items-stretch gap-10">
                        <div
                            data-aos="fade-right"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">What is the expected output of the Case Study Competition?</p>

                            <p className="font-inter font-light mt-5">Participants are expected to submit a structured solution covering technical analysis, feasibility, economic evaluation, ESG considerations, and strategic recommendations.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">What aspects will be evaluated in the competition?</p>

                            <p className="font-inter font-light mt-5">Evaluation criteria include technical accuracy, feasibility, strategy, risk analysis, ESG integration, creativity, presentation quality, and alignment with the case requirements.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row items-stretch gap-10 relative">
                        <div
                            data-aos="fade-right"
                            className="px-5 w-full md:px-20 lg:px-32"
                        >
                            <div className="glass px-5 py-7 md:w-[calc((100%-40px)/2)]">
                                <p className="font-medium text-xl">Do participants need prior knowledge about geologic hydrogen?</p>

                                <p className="font-inter font-light mt-5">Prior knowledge is helpful but not mandatory. Participants are encouraged to study the case materials, guidebook, and relevant references to build a strong understanding of geologic hydrogen, upstream development planning, and techno-economic evaluation.</p>
                            </div>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="shadow-[inset_0_0_1000px_rgba(0,0,0,0.35)] px-5 py-7 bg-linear-to-r from-[#75B0E0] to-[#24EE87] md:w-[47%] md:absolute -bottom-28 right-0"
                        >
                            <p className="font-bold font-inter text-4xl text-shadow-lg">Still Have</p>

                            <p className="font-light font-inter text-2xl text-shadow-lg">Questions?</p>

                            <div className="w-max glass px-5 py-3 shadow-2xl mt-5">Contact Person</div>

                            <div className="flex items-start mt-5 gap-5">
                                <p className="text-base">Manager of Case Study <br />Competition: <br />Areta Tria Bestari <br />(+6285866544088)</p>

                                <p className="text-base">PIC: <br />Farhan Maulana Rizal (+6287808659001) <br />Inaya Putri Khairina (+628119741107)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default CaseStudyCompetition