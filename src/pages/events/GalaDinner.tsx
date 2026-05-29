import { ArrowRight } from "lucide-react"
import Footer from "../../components/landingpage/Footer"
import Navbar from "../../components/landingpage/Navbar"
import bg from "../../images/events/gd/bg-gd.png"
import logo from "../../images/events/gd/logo-gd.png"
import images from "../../images/events/gd/images-gd.png"
import desc from "../../images/events/gd/desc-gd.png"
import Aos from "aos"
import { useEffect } from "react"
import useImagePreload from "../../hooks/useImagePreload"
import { Link } from "react-router-dom"

const GalaDinner = () => {
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
                    <p className="text-2xl text-center text-white font-inter font-light">The <span className="font-semibold">Gala Dinner</span> marks the <span className="font-semibold">formal conclusion of the Oil Week</span> series in a celebratory and memorable setting.</p>
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
                            <p className="text-xl text-white font-inter">To <span className="font-semibold">celebrate</span> and <span className="font-semibold">appreciate</span> the achievements of participants throughout the Oil Week 2026.</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">To provide a memorable <span className="font-semibold">awarding session</span> through the announcement of competition winners and outstanding participants</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">To <span className="font-semibold">strengthen connections</span> and create <span className="font-semibold">memorable experiences</span> among delegates as the closing of the Oil Week.</p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="mt-32"
                >
                    <div className="px-5 md:px-20 lg:px-32 rotate-0 md:-rotate-6">
                        <p className="font-bold text-3xl font-inter text-white">Looking back on Last Year’s: <span className="font-semibold italic font-garamond text-[#E7C66B]">Gala Dinner</span></p>

                        <p className="font-inter text-white text-2xl mt-5">During Oil Week 2025, the Gala Dinner was held as the <span className="font-semibold">final awarding session</span> attended by all finalists from the competition series. The event became a moment of appreciation and celebration, where participants gathered together to witness the winner announcements and commemorate the successful completion of the entire Oil Week program.
                        </p>
                    </div>

                    <div
                        data-aos="zoom-in"
                        data-aos-delay="300"
                        className="mt-10"
                    >
                        <img src={images} alt="" />
                    </div>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default GalaDinner