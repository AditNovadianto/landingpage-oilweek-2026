import { ArrowRight } from "lucide-react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import bg from "../images/competitions/bcc/bg-bcc.png"
import logo from "../images/competitions/bcc/logo-bcc.png"
import timeline from "../images/competitions/bcc/timeline-bcc.png"
import { useEffect } from "react"
import Aos from "aos"

const BusinessCaseCompetition = () => {
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
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Sustained Growth: Strategic Competitiveness under Market Transformation</i></p>
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
                        className="w-[70%] md:w-[50%] m-auto md:m-0 px-20 py-20"
                        src={logo}
                        alt=""
                    />

                    <div
                        data-aos="fade-left"
                        className="flex flex-col items-end"
                    >
                        <div className="glass px-5 py-7 text-white">
                            <p className="text-2xl font-garamond font-semibold">About <i>Business Case Competition</i></p>

                            <p className="mt-5 font-inter font-light">Business Case Competition challenges participants to <span className="font-garamond italic text-[#E7C66B]">analyze a given business problem and develop strategic solutions</span>. Teams will showcase their <span className="font-semibold italic">analytical and communication skills</span> through a pitch deck and a comprehensive paper detailing their proposed solution.</p>
                        </div>

                        <button
                            data-aos="zoom-in"
                            data-aos-delay="200"
                            className="cursor-pointer w-max glass flex items-center text-white font-inter font-light text-lg px-7 py-3 mt-5"
                        >
                            <p>Register Now</p>

                            <ArrowRight />
                        </button>
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
                            <p className="font-medium text-xl">When will the case be released?</p>

                            <p className="font-inter font-light mt-5">The case will be released after the registration period ends, and will be informed periodically through official announcements.</p>
                        </div>
                    </div>

                    <div className="px-5 md:px-20 lg:px-32 mt-10 flex flex-col md:flex-row items-stretch gap-10">
                        <div
                            data-aos="fade-right"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Do we need to use specific business frameworks?</p>

                            <p className="font-inter font-light mt-5">No strict frameworks are required, but using them is highly recommended to structure your analysis.</p>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="glass px-5 py-7 w-full"
                        >
                            <p className="font-medium text-xl">Can we revise our submission after sending it?</p>

                            <p className="font-inter font-light mt-5">No. once the submission has been sent, it is considered final and no further revisions or replacements will be accepted.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row items-stretch gap-10 relative">
                        <div
                            data-aos="fade-right"
                            className="px-5 md:px-20 lg:px-32"
                        >
                            <div className="glass px-5 py-7 md:w-[calc((100%-40px)/2)]">
                                <p className="font-medium text-xl">What language should we use in submission?</p>

                                <p className="font-inter font-light mt-5">All submissions are required to be prepared in English to ensure consistency in the evaluation process.</p>
                            </div>
                        </div>

                        <div
                            data-aos="fade-left"
                            className="shadow-[inset_0_0_1000px_rgba(0,0,0,0.35)] px-5 py-7 bg-linear-to-r from-gray-500 to-white md:w-[47%] md:absolute -bottom-28 right-0"
                        >
                            <p className="font-bold font-inter text-4xl text-shadow-lg">Still Have</p>

                            <p className="font-light font-inter text-2xl text-shadow-lg">Questions?</p>

                            <div className="w-max glass px-5 py-3 shadow-2xl mt-5">Contact Person</div>

                            <div className="flex items-start mt-5 gap-5">
                                <p className="text-base">Manager of Business Case Competition : <br />Nadia Aqila (+62 813 8539 2453)</p>

                                <p className="text-base">PIC: <br />Bryan Putera (+62 812 7569 9168) <br />Deatisa Song (+62 82 1401 7901)
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

export default BusinessCaseCompetition