import { ArrowRight } from "lucide-react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import bg from "../images/competitions/wsc/bg-wsc.png"
import logo from "../images/competitions/wsc/logo-wsc.png"
import timeline from "../images/competitions/wsc/timeline-wsc.png"
import Aos from "aos"
import { useEffect } from "react"

const WellStimulationCompetition = () => {
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
        <div className="bg-cover min-h-screen overflow-hidden" style={{ backgroundImage: `url(${bg})` }}>
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
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Smart & Responsible Well Stimulation: Engineering High-Impact Recovery with Low-Carbon Execution</i></p>
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
                            <p className="text-2xl font-garamond font-semibold">About <i>Well Stimulation Competition</i></p>

                            <p>The Well Stimulation Competition is a <span className="font-garamond italic text-[#E7C66B]">reservoir and production engineering-focused competition</span> that challenges participants to design and justify stimulation strategies to enhance oil and gas well productivity. This competition simulates practical challenges encountered in reservoir engineering, requiring teams to design appropriate stimulation methods such as hydraulic fracturing, acidizing, or other enhanced recovery techniques. The proposed solutions are evaluated based on <span className="font-semibold">technical effectiveness, operational efficiency, and economic feasibility</span>. Participants are encouraged to demonstrate analytical skills, engineering knowledge, and strategic decision-making.</p>
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
                            <p className="font-medium text-xl">Who can participate in the Well Stimulation Competition?</p>

                            <p className="font-inter font-light mt-5">Teams that meet the competition requirements listed in the guidebook may join. Please review the eligibility and registration sections before signing up.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">What is the expected output of the Well Stimulation Competition?</p>

                            <p className="font-inter font-light mt-5">Participants should prepare the required design or analysis files in the format requested by the guidebook, along with any supporting presentation material.</p>
                        </div>
                    </div>

                    <div className="px-5 md:px-20 lg:px-32 mt-10 flex flex-col md:flex-row items-stretch gap-10">
                        <div
                            data-aos="fade-right"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Can we change the submission files when we already submitted it?</p>

                            <p className="font-inter font-light mt-5">Yes, if the dashboard still allows edits, you can update the uploaded file before the deadline. After the deadline, the submission is final.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">How are the submissions evaluated?</p>

                            <p className="font-inter font-light mt-5">Evaluation usually considers technical feasibility, creativity, clarity of explanation, and consistency with the case requirements.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row items-stretch gap-10 relative">
                        <div
                            data-aos="fade-right"
                            className="px-5 w-full md:px-20 lg:px-32"
                        >
                            <div className="glass px-5 py-7 md:w-[calc((100%-40px)/2)]">
                                <p className="font-medium text-xl">Where can we get help if something is unclear?</p>

                                <p className="font-inter font-light mt-5">Please use the Competition PIC contact shown in the help section if you need clarification about the prompt, format, or submission flow.</p>
                            </div>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="shadow-[inset_0_0_1000px_rgba(0,0,0,0.35)] px-5 py-7 bg-linear-to-r from-[#8E2EDD] to-[#4741A4] md:w-[47%] md:absolute -bottom-36 right-0"
                        >
                            <p className="font-bold font-inter text-4xl text-shadow-lg">Still Have</p>

                            <p className="font-light font-inter text-2xl text-shadow-lg">Questions?</p>

                            <div className="w-max glass px-5 py-3 shadow-2xl mt-5">Contact Person</div>

                            <div className="flex items-start mt-5 gap-5">
                                <p className="text-base">Manager of Well Stimulation <br />Competition: <br />Kirana Intan W. (+6281808084043)</p>

                                <p className="text-base">PIC: <br />Daniel Shalahuddin <br />(+6281585885885)
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

export default WellStimulationCompetition