import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import bg from "../../images/competitions/pc/bg-petrosmart.png"
import logo from "../../images/competitions/pc/logo-petrosmart.png"
import timeline from "../../images/competitions/pc/timeline-petrosmart.png"
import Navbar from "../../components/landingpage/Navbar"
import { useEffect } from "react"
import Aos from "aos"
import useImagePreload from "../../hooks/useImagePreload"
import { Link } from "react-router-dom"

const PetrosmartCompetition = () => {
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
                        Petrosmart
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
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Shaping Smart Energy Minds by Integrating Oil & Gas Operations with Renewable Energy and Industry Optimization Strategies</i></p>
                </div>

                <div className="px-5 md:px-20 lg:px-32 mt-20 text-white">
                    <Link to={'/team-leader/sign-up'}
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className="glass cursor-pointer text-center px-7 py-3 flex items-center justify-center gap-5 text-lg font-inter font-light"
                    >
                        <p>Register Now</p>

                        <ArrowRight />
                    </Link>
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
                            <p className="text-2xl font-garamond font-semibold">About <i>Petrosmart Competition</i></p>

                            <p className="mt-5 font-inter font-light">The Oil Week Petrosmart Competition is an <span className="font-garamond italic text-[#E7C66B]">academic quiz competition</span> that brings together university teams in a dynamic battle of knowledge and critical thinking. Participants will compete through a series of fast-paced rounds featuring both technical and non-technical questions related to the oil, gas, and broader energy sectors. Within a limited time allocation, teams are required to answer questions accurately and strategically, with responses evaluated by a panel of judges. This competition is designed to <span className="font-semibold">foster intellectual development, encourage analytical and adaptive thinking, and highlight participants’ understanding</span> of industry-related concepts and practices in a highly competitive environment.</p>
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
                            <p className="font-medium text-xl">Who is eligible to participate in the Petrosmart Competition Oil Week 2026?</p>

                            <p className="font-inter font-light mt-5">The competition is open to all active undergraduate and diploma students majoring in engineering or natural sciences during the registration period, including international students.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Is it allowed for team members to come from different major programs?</p>

                            <p className="font-inter font-light mt-5">Absolutely! Participants from different majors are allowed to form a team, but must come from the same university.</p>
                        </div>
                    </div>

                    <div className="px-5 md:px-20 lg:px-32 mt-10 flex flex-col md:flex-row items-stretch gap-10">
                        <div
                            data-aos="fade-right"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Is the competition individual or team-based?</p>

                            <p className="font-inter font-light mt-5">Participants may register individually. However, forming a team of up to three members is strongly encouraged to maximize collaboration and strategic performance throughout the competition.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Can we change our topic after registering?</p>

                            <p className="font-inter font-light mt-5">Yes. Participants are encouraged to explore resources on oil and gas fundamentals, industry developments, and emerging renewable energy topics through technical glossaries, energy reports, and introductory references.
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
                            className="shadow-[inset_0_0_1000px_rgba(0,0,0,0.35)] px-5 py-7 bg-linear-to-r from-[#38A4D8] to-[#2473EA] md:w-[47%] md:absolute -bottom-28 right-0"
                        >
                            <p className="font-bold font-inter text-4xl text-shadow-lg">Still Have</p>

                            <p className="font-light font-inter text-2xl text-shadow-lg">Questions?</p>

                            <div className="w-max glass px-5 py-3 shadow-2xl mt-5">Contact Person</div>

                            <div className="flex items-start mt-5 gap-5">
                                <p className="text-base">Manager of Petrosmart Competition : <br />Listiani Ayodya W (+62 895 2824 6127)</p>

                                <p className="text-base">PIC: <br />Abigael Kezia (+6287741657997) <br />Zalfa Safira (+6281514353445)
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

export default PetrosmartCompetition