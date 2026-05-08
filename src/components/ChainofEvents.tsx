import logoPreEvent from "../images/logo-pre-event.png"
import logoGrandSeminar from "../images/logo-grand-seminar.png"
import logoJobFair from "../images/logo-job-fair.png"
import logoCompanyVisit from "../images/logo-company-visit.png"
import logoCompetition from "../images/logo-competition.png"
import logoFieldTrip from "../images/logo-field-trip.png"
import logoSPECare from "../images/logo-spe-care.png"
import logoSCGath from "../images/logo-sc-gatb.png"
import logoGalaDinner from "../images/logo-gala-dinner.png"

const ChainofEvents = () => {
    return (
        <div className="border border-red-500 mt-10 px-7 md:px-20 lg:px-32 py-10 min-h-screen">
            <div className="text-white mt-10 md:mt-40">
                <p className="text-5xl font-inter font-bold">Chain</p>
                <p className="text-3xl font-garamond font-light">of Events</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">The Pre-Event : <span className="font-semibold font-garamond italic text-[#E7C66B]">Oil on Court</span> is a Padel session designed as an engaging and interactive sports networking activity before the main events of <span className="italic font-semibold">Oil Week 2026</span>.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoPreEvent} />
                        <p className="italic text-2xl font-garamond text-white">Pre Event</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">This event serves as the <span className="font-semibold font-garamond italic text-[#E7C66B]">Opening Event</span> for Oil Week. The first part will feature a <span className="italic font-semibold">seminar</span> led by esteemed professional speakers. The second part will be a <span className="italic font-semibold">career talk</span> session.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoGrandSeminar} />
                        <p className="italic text-2xl font-garamond text-white">Grand Seminar X Skill Finder</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">An interactive program that serves as a <span className="font-semibold font-garamond italic text-[#E7C66B]">Career Boost</span> for members to begin their <span className="italic font-semibold">professional journey</span> by connecting them with various companies and employment opportunities.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoJobFair} />
                        <p className="italic text-2xl font-garamond text-white">Job Fair</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">The company visit aims to give members a <span className="font-semibold font-garamond italic text-[#E7C66B]">Direct Understanding</span> of how an oil and gas company operates through learning sessions with <span className="italic font-semibold">industry professionals</span>.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoCompanyVisit} />
                        <p className="italic text-2xl font-garamond text-white">Company Visit</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">This year, <span className="font-semibold italic">Oil Week 2026</span> features <span className="font-semibold font-garamond italic text-[#E7C66B]">6 Competitions</span>:</p>

                    <div className="flex items-center gap-2 px-10 mt-5">
                        <ul className="list-disc text-white text-[11px] italic flex flex-col gap-1">
                            <li><span className="font-semibold">Business Case</span> Competition</li>
                            <li><span className="font-semibold">Paper and Poster</span> Competition</li>
                            <li><span className="font-semibold">Case Study</span> Competition</li>
                        </ul>

                        <ul className="list-disc text-white text-[11px] italic flex flex-col gap-1">
                            <li><span className="font-semibold">Well Stimulation</span> Competition</li>
                            <li><span className="font-semibold">Mud Innovation</span> Competition</li>
                            <li><span className="font-semibold">Petrosmart</span> Competition</li>
                        </ul>
                    </div>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoCompetition} />
                        <p className="italic text-2xl font-garamond text-white">Competition</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">The field trip program is designed to give members and officers <span className="font-semibold font-garamond italic text-[#E7C66B]">Firsthand Experience</span> in understanding the work life of a <span className="font-semibold">field engineer</span>.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoFieldTrip} />
                        <p className="italic text-2xl font-garamond text-white">Field Trip</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">SPE Care is a <span className="font-semibold font-garamond italic text-[#E7C66B]">Community Service Program</span> for members and officers that is aimed to create a meaningful and <span className="font-semibold">positive</span> impact to society.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoSPECare} />
                        <p className="italic text-2xl font-garamond text-white">SPE Care</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">Student Chapter Gathering brings together <span className="font-semibold font-garamond italic text-[#E7C66B]">SPE Student Chapters</span> to <span className="font-semibold">exchange ideas</span> and best practices on organizational dynamics, work programs, and effective chapter management</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoSCGath} />
                        <p className="italic text-2xl font-garamond text-white">SC Gath</p>
                    </div>
                </div>

                <div className="glass py-5 relative pb-24">
                    <p className="text-white font-light text-xl px-6 py-y">The Gala Dinner is the awarding night and <span className="font-semibold font-garamond italic text-[#E7C66B]">Grand Closing</span> of Oil Week, celebrating the achievements of participants and announcing the <span className="font-semibold">competition winners</span>.</p>

                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2">
                        <img className="w-20" src={logoGalaDinner} />
                        <p className="italic text-2xl font-garamond text-white">Gala Dinner</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChainofEvents