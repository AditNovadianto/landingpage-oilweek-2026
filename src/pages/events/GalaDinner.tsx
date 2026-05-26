import { ArrowRight } from "lucide-react"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import bg from "../../images/events/gd/bg-gd.png"
import logo from "../../images/events/gd/logo-gd.png"
import images from "../../images/events/gd/images-gd.png"
import desc from "../../images/events/gd/desc-gd.png"
import Aos from "aos"
import { useEffect } from "react"

const GalaDinner = () => {
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
                <img className="w-[90%] md:w-[35%]" src={logo} alt="" />

                <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="px-5 md:px-20 lg:px-32 mt-14"
                >
                    <p className="text-2xl text-center text-white font-inter font-light"><span className="font-semibold"><i>Company Visit</i></span> is an educational event that provides participants with the <span className="font-semibold">opportunity to gain firsthand insight into the professional world and working environment</span> within the energy industry.</p>
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
                            <p className="text-xl text-white font-inter">Expand participants’ <span className="font-semibold">understanding of the energy industry</span></p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Provide insight into <span className="font-semibold">professional work environments and career paths</span></p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter"><span className="font-semibold">Build connections</span> between students and industry <span className="font-semibold">professionals</span></p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="mt-32"
                >
                    <div className="px-5 md:px-20 lg:px-32 rotate-0 md:-rotate-6">
                        <p className="font-bold text-3xl font-inter text-white">Looking back on Last Year’s: <span className="font-semibold italic font-garamond text-[#E7C66B]">Company Visit</span></p>

                        <p className="font-inter text-white text-2xl mt-5">Last year’s Company Visit to <span className="font-semibold">PT Perusahaan Gas Negara (PGN)</span> provided participants with an exciting opportunity to gain firsthand insight into Indonesia’s energy industry. <span className="font-semibold">Through company presentations, office tours, and interactive sharing sessions with professionals</span>, participants explored real-world industry practices, career opportunities, and the dynamic working environment within one of Indonesia’s leading gas companies.
                        </p>

                        <p className="mt-10 font-garamond italic font-semibold text-white text-xl">Bigger insights, broader connections, and new industry experiences await. See you at Company Visit 2026!</p>
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
                    <p className="text-xl font-inter text-white text-end">CP : <br />IFadhilah Rasya Putra <br />External Affairs Associate <br />081215417191
                    </p>

                    <p className="mt-10 text-xl font-inter text-white text-end">ULaura Nathania Simatupang <br />External Affairs Associate <br />081362233632</p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Gina Ramadhania Wahyu <br />Deputy Director of External Affairs <br />085858066861
                    </p>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default GalaDinner