import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/events/gsXsf/bg-gsXsf.png"
import logo from "../../images/events/gsXsf/logo-gsXsf.png"
import images from "../../images/events/gsXsf/images-gsXsf.png"
import desc from "../../images/events/gsXsf/desc-gsXsf.png"
import Aos from "aos"
import { useEffect } from "react"
import useImagePreload from "../../hooks/useImagePreload"
import { Link } from "react-router-dom"

const GrandSeminarXSkillFinder = () => {
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
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Grand Seminar X Skill Finder</i> is the opening event of <span className="font-semibold">Oil Week 2026</span>, featuring insightful energy industry seminars alongside interactive career development sessions designed to <span className="font-garamond italic text-[#E7C66B] font-semibold">prepare participants for the professional world</span>, while also providing exposure to potential <span className="font-semibold italic">Internship Opportunities</span> from leading companies.</p>
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
                            <p className="text-xl text-white font-inter">Provide insights into <span className="font-semibold">current issues and innovations</span> in the oil and gas industry</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Deliver an engaging experience that combines <span className="font-semibold">industry knowledge and career development</span></p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Enhance participants’ <span className="font-semibold">career readiness</span> through interactive professional sessions</p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row items-stretch gap-5 w-full">
                        <div
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Introduce participants to <span className="font-semibold">professional pathways</span> and potential <span className="font-semibold italic">internship opportunities</span></p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Deliver an engaging experience that combines <span className="font-semibold">industry knowledge and career development</span></p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="mt-32"
                >
                    <div className="px-5 md:px-20 lg:px-32 rotate-0 md:-rotate-6">
                        <p className="font-bold text-3xl font-inter text-white">Looking back on Last Year’s: Skill Finder<span className="font-semibold italic font-garamond text-[#E7C66B]">Pre Event</span></p>

                        <p className="font-inter text-white text-2xl mt-5">The Previous Grand Seminar X Skill Finder has been successfully held for the past 2 years, engaging <span className="font-semibold">600+ participants</span> and <span className="font-semibold">7+ professionals</span> through seminars, HR talks, CV reviews, and internship opportunities. Collaborating with top companies in the Oil & Gas industry, the event provided valuable industry insights and supported students’ career readiness and professional development</p>
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
                    <p className="text-xl font-inter text-white text-end">Ahmad Andri Kautsar <br />PIC of Skill Finder <br />+6282280557972</p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Fatih Abqary Zhafran <br />Co-Director of HRD SPE UI SC 2026 <br />+62 81281939060</p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Artanti Waranggani <br />Director of HRD SPE UI SC 2026 <br />+62 85773924238</p>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default GrandSeminarXSkillFinder