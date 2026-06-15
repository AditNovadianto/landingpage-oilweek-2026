import { ArrowRight } from "lucide-react"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/competitions/pcc/bg-ppc.png"
import logo from "../../images/competitions/pcc/logo-ppc.png"
import timeline from "../../images/competitions/pcc/timeline-ppc.png"
import Footer from "../../components/landingpage/Footer"
import { useEffect } from "react"
import Aos from "aos"
import useImagePreload from "../../hooks/useImagePreload"
import { Link } from "react-router-dom"

const PaperandPosterCompetition = () => {
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
                        Paper & Poster
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
                    <p className="text-2xl text-center text-white font-inter font-light">Accelerating Low-Carbon Industry through Optimization : <i>Integrating Clean Energy, Efficiency, and Innovation for Sustainable Growth</i></p>
                </div>

                <div className="px-5 md:px-20 lg:px-32 mt-20 text-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        <div
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="glass text-center px-7 py-5 flex items-center justify-center text-lg min-h-32 font-inter font-light"
                        >
                            Process & Operational Excellence
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="glass text-center px-7 py-5 flex items-center justify-center text-lg min-h-32 font-inter font-light"
                        >
                            Energy Efficiency & Industrial Energy Optimization
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="glass text-center px-7 py-5 flex items-center justify-center text-lg min-h-32 font-inter font-light"
                        >
                            Digitalization and Smart Manufacturing for Decarbonization
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass text-center px-7 py-5 flex items-center justify-center text-lg min-h-32 font-inter font-light"
                        >
                            Low-Carbon Technology & Process Innovation
                        </div>
                    </div>
                </div>

                <div className="px-5 md:px-20 lg:px-32 flex flex-col md:flex-row items-center justify-center">
                    <img
                        data-aos="fade-right"
                        className="w-[70%] md:w-[50%] m-auto md:m-0"
                        src={logo}
                        alt=""
                    />

                    <div
                        data-aos="fade-left"
                        className="flex flex-col items-end"
                    >
                        <div className="glass px-5 py-7 text-white">
                            <p className="text-2xl font-garamond font-semibold">About <i>Paper and Poster Competition</i></p>

                            <p className="mt-5 font-inter font-light">Paper and Poster Competition is where participants <span className="font-garamond italic text-[#E7C66B]">submit and present their innovations</span>, based on given theme. They will <span className="italic font-semibold">produce a paper</span> detailing their ideas and present them through a presentation on pitching day.</p>
                        </div>

                        <Link to={'/team-leader/sign-up'}
                            data-aos="zoom-in"
                            data-aos-delay="200"
                            className="cursor-pointer w-max glass flex items-center text-white font-inter font-light text-lg px-7 py-3 mt-5"
                        >
                            <p>Register Now</p>

                            <ArrowRight />
                        </Link>
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
                            <p className="font-medium text-xl">Who can participate in this competition?</p>

                            <p className="font-inter font-light mt-5">The competition is open to international undergraduate students. Participants must register as a team consisting of a minimum of 2 members and a maximum of 3 members, and all team members must be from the same university.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Can students from different majors join in one team?</p>

                            <p className="font-inter font-light mt-5">Yes, participants from different academic majors are allowed to form a team, as long as that all members are from the same university.</p>
                        </div>
                    </div>

                    <div className="px-5 md:px-20 lg:px-32 mt-10 flex flex-col md:flex-row items-stretch gap-10">
                        <div
                            data-aos="fade-right"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">What language should be used during the competition?</p>

                            <p className="font-inter font-light mt-5">All submissions are required to be prepared in English to ensure consistency in the evaluation process.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Can we change our topic after registering?</p>

                            <p className="font-inter font-light mt-5">Changes are allowed as long as they are made before the submission stage. Once the work has been submitted and proceeds to the next stage, no further changes will be permitted.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row items-stretch gap-10 relative">
                        <div
                            data-aos="fade-right"
                            className="px-5 w-full md:px-20 lg:px-32"
                        >
                            <div className="glass px-5 py-7 md:w-[calc((100%-40px)/2)]">
                                <p className="font-medium text-xl">Can we change team members after registration?</p>

                                <p className="font-inter font-light mt-5">No, changes to team composition are not permitted once the registration has been completed. All registered team members are considered final and cannot be replaced under any circumstances.</p>
                            </div>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="shadow-[inset_0_0_1000px_rgba(0,0,0,0.35)] px-5 py-7 bg-linear-to-r from-[#FFE44C] to-[#F1944A] md:w-[47%] md:absolute -bottom-28 right-0"
                        >
                            <p className="font-bold font-inter text-4xl text-shadow-lg">Still Have</p>

                            <p className="font-light font-inter text-2xl text-shadow-lg">Questions?</p>

                            <div className="w-max glass px-5 py-3 shadow-2xl mt-5">Contact Person</div>

                            <div className="flex items-start mt-5 gap-5">
                                <p className="text-base">Manager of Paper and Poster Competition : <br />Nadia Aqila (+62 813 8539 2453)</p>

                                <p className="text-base">PIC: <br />Anindya Zhafira (+62 813 1600 3178) <br />Parsa Ghani (+62 877 8151 8796)
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

export default PaperandPosterCompetition