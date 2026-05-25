import { ArrowRight } from "lucide-react"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import bg from "../../images/events/jf/bg-jf.png"
import logo from "../../images/events/jf/logo-jf.png"
import images from "../../images/events/jf/images-jf.png"
import desc from "../../images/events/jf/desc-jf.png"
import Aos from "aos"
import { useEffect } from "react"

const JobFair = () => {
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
                    <p className="text-2xl text-center text-white font-inter font-light"><i>Job Fair 2026: Beyond the Horizon</i>, Mapping Your Career connects students and fresh graduates with <span className="font-semibold">top companies</span> in the energy and related industries, offering <span className="font-semibold italic">career exploration, professional networking, and direct industry insights.</span></p>
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
                            <p className="text-xl text-white font-inter">Connect participants with <span className="font-semibold">top companies</span> and <span className="font-semibold">industry professionals.</span></p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="250"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Provide opportunities to <span className="font-semibold">explore career</span> and <span className="font-semibold">internship</span> pathways through direct industry engagement.</p>
                        </div>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="glass flex items-center justify-center text-center px-12 py-8"
                        >
                            <p className="text-xl text-white font-inter">Equip students and fresh graduates with <span className="font-semibold">industry insights</span> to navigate <span className="font-semibold">future career</span> opportunities.</p>
                        </div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in-up"
                    className="mt-32"
                >
                    <div className="px-5 md:px-20 lg:px-32 rotate-0 md:-rotate-6">
                        <p className="font-bold text-3xl font-inter text-white">Looking back on Last Year’s: <span className="font-semibold italic font-garamond text-[#E7C66B]">Job Fair: Your First Step to Success</span></p>

                        <p className="font-inter text-white text-2xl mt-5">Job Fair 2025, featured 4 companies, namely <span className="font-semibold">Pertamina Hulu Energi, ExxonMobil Lubricants, PT. Bakrie Pipe Industries, and Bank Mandiri</span>, alongside 2 food & beverage partners, <span className="font-semibold">Park 5 Hotel and Shihlin</span>. Attracting more than 350 participants from both Universitas Indonesia and other universities, the event successfully connected students and fresh graduates with industry professionals through career exploration, networking, and direct company engagement. Discover opportunities and map your future career journey with us at Job Fair 2026.</p>
                    </div>

                    <div
                        data-aos="zoom-in"
                        data-aos-delay="300"
                        className="scale-[1.5] mt-28 translate-x-62.5"
                    >
                        <img src={images} alt="" />
                    </div>
                </div>

                <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="w-full flex flex-col items-end px-5 md:px-20 lg:px-32 mt-20"
                >
                    <p className="text-xl font-inter text-white text-end">CP : <br />Indah Cindy Oktariyani <br />Person In Charge of Job Fair 2026 <br />+6283155585979
                    </p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Udurma Theodora Daniella Silaban <br />Co-Director of HRD SPE UI SC 2026 <br />+62 81281939060</p>

                    <p className="mt-10 text-xl font-inter text-white text-end">Artanti Waranggani <br />Director of HRD SPE UI SC 2026 <br />+62 85773924238</p>
                </div>
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

export default JobFair