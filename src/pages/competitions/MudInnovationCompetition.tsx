import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/competitions/mic/bg-mic.png"
import logo from "../../images/competitions/mic/logo-mic.png"
import timeline from "../../images/competitions/mic/timeline-mic.png"
import Aos from "aos"
import { useEffect } from "react"
import useImagePreload from "../../hooks/useImagePreload"
import { Link } from "react-router-dom"

const MudInnovationCompetition = () => {
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
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Circular Drilling Fluids: Designing High-Performance Mud Systems for a Low-Carbon Future</i></p>
                </div>

                <div className="px-5 md:px-20 lg:px-32 mt-20 text-white">
                    <Link to={'/sign-up'}
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className="glass cursor-pointer text-center px-7 py-3 flex items-center justify-center gap-5 text-lg font-inter font-light"
                    >
                        <p>Register Now</p>

                        <ArrowRight />
                    </Link>
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
                            <p className="text-2xl font-garamond font-semibold">About <i>Mud Innovation Competition</i></p>

                            <p>The Mud Innovation Competition is a <span className="font-garamond italic text-[#E7C66B]">technical problem-solving and formulation-based competition</span> that challenges participants to design innovative, efficient, and sustainable drilling fluid systems tailored to real-world drilling conditions. Participants are challenged to develop <span className="font-semibold">innovative and effective solutions to real-world drilling problems</span> by designing optimal drilling fluid systems. It serves maintaining well control by balancing formation pressure, transporting drilled cuttings to the surface (hole cleaning), and ensuring wellbore stability by preventing issues such as clay swelling or formation collapse.</p>
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
                            <p className="font-medium text-xl">Who can participate in the Mud Innovation Competition?</p>

                            <p className="font-inter font-light mt-5">Teams that meet the competition requirements listed in the guidebook may join. Please review the eligibility and registration sections before signing up.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">What is the expected output of the Mud Innovation Competition?</p>

                            <p className="font-inter font-light mt-5">Yes, participants from different academic majors are allowed to form a team, as long as that all members are from the same university.</p>
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
                            className="shadow-[inset_0_0_1000px_rgba(0,0,0,0.35)] px-5 py-7 bg-linear-to-r from-[#F77D34] to-[#DE2C6B] md:w-[47%] md:absolute -bottom-36 right-0"
                        >
                            <p className="font-bold font-inter text-4xl text-shadow-lg">Still Have</p>

                            <p className="font-light font-inter text-2xl text-shadow-lg">Questions?</p>

                            <div className="w-max glass px-5 py-3 shadow-2xl mt-5">Contact Person</div>

                            <div className="flex items-start mt-5 gap-5">
                                <p className="text-base">Manager of Mud Innovation <br />Competition: <br />Kirana Intan W. (+6281808084043)</p>

                                <p className="text-base">PIC: <br />Vince Cendrix (+62 858 9130 6073)
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

export default MudInnovationCompetition