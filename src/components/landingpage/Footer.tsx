import logoOw from "../../images//Logo-ow.png"
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import sponsorPertaminaInternasionalEP from "../../images/sponsor-pertamina-internasional-ep.webp"
import sponsorRockFlowDynamics from "../../images/sponsor-rock-flow-dynamics.png"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react";

const Footer = () => {
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            easing: "ease-in-out",
        });
    }, []);

    return (
        <>
            <div
                id="contact"
                className="relative px-5 md:px-20 lg:px-32 py-10 mt-10 flex flex-col md:flex-row items-start gap-5 justify-between w-full"
            >
                <div
                    className="w-full md:w-[50%]"
                    data-aos="fade-right"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                        <img
                            className="w-20 animate-pulse m-auto md:m-0"
                            src={logoOw}
                            alt="logo ow"
                            data-aos="zoom-in"
                            data-aos-delay="100"
                        />

                        <div
                            className="w-full md:w-[50%]"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <p className="text-center md:text-start text-4xl text-inter font-bold text-white">
                                Oil Week
                            </p>

                            <p className="text-center md:text-start font-inter text-3xl font-light text-white">
                                2026
                            </p>

                            <p className="text-center md:text-start mt-5 font-inter font-light text-sm text-white">
                                Oil Week is the flagship annual event organized by SPE UI SC
                            </p>
                        </div>
                    </div>

                    <div
                        className="mt-5 text-center md:text-start"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <p className="font-inter font-semibold text-lg text-white">Address</p>

                        <p className="font-inter font-light text-sm text-white">
                            Suwandi, JRPF+JM7, Departemen Teknik Kimia, Fakultas Teknik UI, Jl. Dr. Indro S, Kukusan, Beji, Depok City, West Java 16424
                        </p>
                    </div>

                    <div
                        className="mt-5 text-center md:text-start"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        <p className="font-inter font-semibold text-lg text-white">Contact Us</p>

                        <p className="font-inter font-light text-sm text-white">
                            Head of Public Relations <br />
                            Valencia Jolie Bong <br />
                            Phone: +62 812-8856-2999
                        </p>
                    </div>
                </div>

                <div
                    className="px-5 mt-10 md:mt-0 flex flex-col md:flex-row items-start gap-10 md:gap-20"
                    data-aos="fade-left"
                    data-aos-delay="500"
                >
                    <div>
                        <p className="text-lg font-inter text-white font-light">Event</p>

                        <ul className="text-white font-light font-inter">
                            <li className="list-disc mt-2">Pre-Event : Oil on Court</li>
                            <li className="list-disc mt-2">Grand Seminar X Skill Finder</li>
                            <li className="list-disc mt-2">Company Visit</li>
                            <li className="list-disc mt-2">Field Trip</li>
                            <li className="list-disc mt-2">Job Fair</li>
                            <li className="list-disc mt-2">Student Chapter Gathering</li>
                            <li className="list-disc mt-2">Gala Dinner</li>
                            <li className="list-disc mt-2">SPE Care</li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-lg font-inter text-white font-light">Competition</p>

                        <ul className="text-white font-light font-inter">
                            <li className="list-disc mt-2">Petrosmart Competition</li>
                            <li className="list-disc mt-2">Paper and Poster Competition</li>
                            <li className="list-disc mt-2">Business Case Competition</li>
                            <li className="list-disc mt-2">Mud Innovation Competition</li>
                            <li className="list-disc mt-2">Well Stimulation Competition</li>
                        </ul>
                    </div>
                </div>

                <div
                    className="mt-5 md:mt-0 md:absolute bottom-5 right-5 glass px-7 py-3 flex items-center gap-5"
                    data-aos="zoom-in"
                    data-aos-delay="700"
                >
                    <a
                        href="https://www.instagram.com/oilweek.ui/"
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                        <FaInstagram className="text-white" />

                        <p className="text-white font-inter font-light text-sm">
                            oilweek.ui
                        </p>
                    </a>

                    <a
                        href="https://www.linkedin.com/company/speuisc/"
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                        <FaLinkedin className="text-white" />

                        <p className="md:text-nowrap text-white font-inter font-light text-sm">
                            SPE Universitas Indonesia SC
                        </p>
                    </a>
                </div>
            </div>

            <div
                className="mt-10 px-5 md:px-20 lg:px-32 py-10 w-full bg-white"
            >
                <p className="font-semibold font-inter text-2xl">Sponsored By</p>

                <div className="mt-10 w-full flex items-center justify-center gap-10">
                    <img
                        src={sponsorPertaminaInternasionalEP}
                        alt="Sponsor Pertamina Internasional EP"
                        className="w-80"
                    />

                    <img
                        src={sponsorRockFlowDynamics}
                        alt="Sponsor Rock Flow Dynamics"
                        className="w-72"
                    />
                </div>
            </div>
        </>
    )
}

export default Footer