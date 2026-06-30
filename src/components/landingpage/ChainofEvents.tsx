import logoPreEvent from "../../images/logo-pre-event.png"
import logoGrandSeminar from "../../images/logo-grand-seminar.png"
import logoJobFair from "../../images/logo-job-fair.png"
import logoCompanyVisit from "../../images/logo-company-visit.png"
import logoCompetition from "../../images/logo-competition.png"
import logoFieldTrip from "../../images/logo-field-trip.png"
import logoSPECare from "../../images/logo-spe-care.png"
import logoSCGath from "../../images/logo-sc-gatb.png"
import logoGalaDinner from "../../images/logo-gala-dinner.png"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const ChainofEvents = () => {
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            easing: "ease-in-out",
        })
    }, [])

    const cardClass = "glass relative flex h-full w-full flex-col pt-5 pb-24"
    const wrapperClass = "h-full"
    const paragraphClass = "text-white text-xl px-6 flex-1"
    const labelWrapperClass =
        "absolute w-[90%] -bottom-5 -left-5 flex items-center gap-3"
    const logoClass = "w-20 shrink-0"
    const titleClass = "italic text-2xl font-garamond text-white whitespace-nowrap"
    const lineClass =
        "flex-1 h-1 rounded-full bg-linear-to-r from-[#B8860B] via-[#FFD700] to-white"

    return (
        <div className="mt-10 px-7 md:px-20 lg:px-32 py-10 min-h-screen">
            <div data-aos="fade-right" className="text-white mt-10 md:mt-40">
                <p className="text-5xl font-inter font-bold">Chain</p>
                <p className="text-3xl font-garamond font-light">
                    of Events{" "}
                    <span className="m-auto inline-block align-middle w-10 h-1 bg-linear-to-b from-yellow-400 via-yellow-200 to-white"></span>
                </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 auto-rows-fr">
                <div data-aos="fade-up" data-aos-delay="100" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            The Pre-Event :{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Oil on Court
                            </span>{" "}
                            is a Padel session designed as an engaging and interactive sports
                            networking activity before the main events of{" "}
                            <span className="italic font-semibold">Oil Week 2026</span>.
                        </p>

                        <div className={labelWrapperClass}>
                            <img className={logoClass} src={logoPreEvent} alt="Pre Event" />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>Pre Event</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/pre-event" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="200" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            This event serves as the{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Opening Event
                            </span>{" "}
                            for Oil Week. The first part will feature a{" "}
                            <span className="italic font-semibold">seminar</span> led by
                            esteemed professional speakers. The second part will be a{" "}
                            <span className="italic font-semibold">career talk</span> session.
                        </p>

                        <div className={labelWrapperClass}>
                            <img
                                className={logoClass}
                                src={logoGrandSeminar}
                                alt="Grand Seminar X Skill Finder"
                            />
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <p className="-translate-y-2 italic text-2xl font-garamond text-white leading-tight flex-1">
                                    Grand Seminar X Skill Finder
                                </p>

                                <span className="w-28 h-1 rounded-full bg-linear-to-r from-[#B8860B] via-[#FFD700] to-white mt-6 shrink-0"></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/grand-seminar-x-skill-finder" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="300" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            An interactive program that serves as a{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Career Boost
                            </span>{" "}
                            for members to begin their{" "}
                            <span className="italic font-semibold">professional journey</span>{" "}
                            by connecting them with various companies and employment
                            opportunities.
                        </p>

                        <div className={labelWrapperClass}>
                            <img className={logoClass} src={logoJobFair} alt="Job Fair" />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>Job Fair</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/job-fair" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="400" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            The company visit aims to give members a{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Direct Understanding
                            </span>{" "}
                            of how an oil and gas company operates through learning sessions
                            with{" "}
                            <span className="italic font-semibold">industry professionals</span>.
                        </p>

                        <div className={labelWrapperClass}>
                            <img
                                className={logoClass}
                                src={logoCompanyVisit}
                                alt="Company Visit"
                            />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>Company Visit</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/company-visit" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="500" className={wrapperClass}>
                    <div className={cardClass}>
                        <div className="flex-1">
                            <p className="text-white text-xl px-6">
                                This year,{" "}
                                <span className="font-semibold italic">Oil Week 2026</span>{" "}
                                features{" "}
                                <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                    6 Competitions
                                </span>
                                :
                            </p>

                            <div className="flex items-start gap-5 px-10 mt-5">
                                <ul className="list-disc text-white text-[11px] italic flex flex-col gap-1">
                                    <li>
                                        <span className="font-semibold">Business Case</span>{" "}
                                        Competition
                                    </li>
                                    <li>
                                        <span className="font-semibold">Paper and Poster</span>{" "}
                                        Competition
                                    </li>
                                    <li>
                                        <span className="font-semibold">Case Study</span>{" "}
                                        Competition
                                    </li>
                                </ul>

                                <ul className="list-disc text-white text-[11px] italic flex flex-col gap-1">
                                    <li>
                                        <span className="font-semibold">Well Stimulation</span>{" "}
                                        Competition
                                    </li>
                                    <li>
                                        <span className="font-semibold">Mud Innovation</span>{" "}
                                        Competition
                                    </li>
                                    <li>
                                        <span className="font-semibold">Petrosmart</span>{" "}
                                        Competition
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className={labelWrapperClass}>
                            <img
                                className={logoClass}
                                src={logoCompetition}
                                alt="Competition"
                            />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>Competition</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="600" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            The field trip program is designed to give members and officers{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Firsthand Experience
                            </span>{" "}
                            in understanding the work life of a{" "}
                            <span className="font-semibold">field engineer</span>.
                        </p>

                        <div className={labelWrapperClass}>
                            <img className={logoClass} src={logoFieldTrip} alt="Field Trip" />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>Field Trip</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/field-trip" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="700" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            SPE Care is a{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Community Service Program
                            </span>{" "}
                            for members and officers that is aimed to create a meaningful and{" "}
                            <span className="font-semibold">positive</span> impact to society.
                        </p>

                        <div className={labelWrapperClass}>
                            <img className={logoClass} src={logoSPECare} alt="SPE Care" />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>SPE Care</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/spe-care" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="800" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            Student Chapter Gathering brings together{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                SPE Student Chapters
                            </span>{" "}
                            to <span className="font-semibold">exchange ideas</span> and best
                            practices on organizational dynamics, work programs, and effective
                            chapter management.
                        </p>

                        <div className={labelWrapperClass}>
                            <img className={logoClass} src={logoSCGath} alt="SC Gath" />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>SC Gath</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/student-chapter-gathering" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="900" className={wrapperClass}>
                    <div className={cardClass}>
                        <p className={paragraphClass}>
                            The Gala Dinner is the awarding night and{" "}
                            <span className="font-semibold font-garamond italic text-[#E7C66B]">
                                Grand Closing
                            </span>{" "}
                            of Oil Week, celebrating the achievements of participants and
                            announcing the{" "}
                            <span className="font-semibold">competition winners</span>.
                        </p>

                        <div className={labelWrapperClass}>
                            <img
                                className={logoClass}
                                src={logoGalaDinner}
                                alt="Gala Dinner"
                            />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <p className={titleClass}>Gala Dinner</p>
                                <span className={lineClass}></span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-5">
                            <Link to="/gala-dinner" className="text-white">
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChainofEvents