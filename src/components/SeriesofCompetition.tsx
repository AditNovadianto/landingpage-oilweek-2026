import { ArrowRight } from 'lucide-react'
import logoBusinessCase from '../images/logo-business-case.png'
import logoCaseStudy from '../images/logo-case-study.png'
import logoMudInnovation from '../images/logo-mud-innovation.png'
import logoPaperandPoster from '../images/logo-paper-and-poster.png'
import logoPetrosmart from '../images/logo-petrosmart.png'
import logoWellStimulation from '../images/logo-well-stimulation.png'

const SeriesofCompetition = () => {
    return (
        <div id='competitions' className="px-32 py-10 mt-36 min-h-screen border border-red-500">
            <div className="w-max ml-auto">
                <p className="glass px-8 py-6 text-white text-5xl font-inter font-light"><span className="font-garamond italic font-semibold">Series</span> of <span className="underline">Competition</span></p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 items-stretch'>
                <div className='relative pb-20 glass px-5 py-3 flex flex-col'>
                    <div className='flex items-center gap-3'>
                        <img className='w-32' src={logoPetrosmart} alt="Petrosmart Logo" />

                        <div className='text-white'>
                            <p className='font-garamond text-3xl italic underline'>Petrosmart</p>
                            <p className='text-2xl font-light font-inter'>Competition</p>
                        </div>
                    </div>

                    <p className='text-white font-light text-xl mt-4'>
                        Petrosmart Competition is a <span className='font-semibold font-garamond italic text-[#E7C66B]'>quick round smart competition</span> in which teams of <span className='font-semibold italic'>3 people test their knowledge</span> of oil and gas by answering different types of formatted questions. Teams will be evaluated on their understanding on topics such as Geology, Drilling, and Production.
                    </p>

                    <button className='absolute bottom-5 right-5 cursor-pointer w-max text-white glass px-7 py-3'>
                        <ArrowRight />
                    </button>
                </div>

                <div className='relative pb-20 glass px-5 py-3 flex flex-col'>
                    <div className='flex items-center gap-3'>
                        <img className='w-32' src={logoPaperandPoster} alt="Paper & Poster Logo" />

                        <div className='text-white'>
                            <p className='font-garamond text-3xl italic underline'>Paper <span className='font-inter'>&</span> Poster</p>
                            <p className='text-2xl font-light font-inter'>Competition</p>
                        </div>
                    </div>

                    <p className='text-white font-light text-xl mt-4'>
                        Paper and Poster Competition is where participants <span className='font-semibold font-garamond italic text-[#E7C66B]'>submit and present their innovations</span>, based on given theme. They will <span className='font-semibold italic'>produce a paper</span> detailing their ideas and present them through a presentation on pitching day.
                    </p>

                    <button className='absolute bottom-5 right-5 cursor-pointer w-max text-white glass px-7 py-3'>
                        <ArrowRight />
                    </button>
                </div>

                <div className='relative pb-20 glass px-5 py-3 flex flex-col'>
                    <div className='flex items-center gap-3'>
                        <img className='w-20 m-5' src={logoBusinessCase} alt="Business Case Logo" />

                        <div className='text-white'>
                            <p className='font-garamond text-3xl italic underline'>Business Case</p>
                            <p className='text-2xl font-light font-inter'>Competition</p>
                        </div>
                    </div>

                    <p className='text-white font-light text-xl mt-4'>
                        Petrosmart Competition is a <span className='font-semibold font-garamond italic text-[#E7C66B]'>quick round smart competition</span> in which teams of <span className='font-semibold italic'>3 people test their knowledge</span> of oil and gas by answering different types of formatted questions. Teams will be evaluated on their understanding on topics such as Geology, Drilling, and Production.
                    </p>

                    <button className='absolute bottom-5 right-5 cursor-pointer w-max text-white glass px-7 py-3'>
                        <ArrowRight />
                    </button>
                </div>

                <div className='relative pb-20 glass px-5 py-3 flex flex-col'>
                    <div className='flex items-center gap-3'>
                        <img className='w-20 m-5' src={logoMudInnovation} alt="Mud Innovation Logo" />

                        <div className='text-white'>
                            <p className='font-garamond text-3xl italic underline'>Mud Innovation</p>
                            <p className='text-2xl font-light font-inter'>Competition</p>
                        </div>
                    </div>

                    <p className='text-white font-light text-xl mt-4'>
                        Mud Innovation Competition tasks the participants to <span className='font-semibold font-garamond italic text-[#E7C66B]'>propose pioneering drilling mud solutions for real world oil and gas challenges</span>. Teams will showcase their technical expertise by <span className='font-semibold italic'>inventing new drilling mud formulations</span> created by using software and conducting lab tests.
                    </p>

                    <button className='absolute bottom-5 right-5 cursor-pointer w-max text-white glass px-7 py-3'>
                        <ArrowRight />
                    </button>
                </div>

                <div className='relative pb-20 glass px-5 py-3 flex flex-col'>
                    <div className='flex items-center gap-3'>
                        <img className='w-20 m-5' src={logoWellStimulation} alt="Well Stimulation Logo" />

                        <div className='text-white'>
                            <p className='font-garamond text-3xl italic underline'>Well Stimulation</p>
                            <p className='text-2xl font-light font-inter'>Competition</p>
                        </div>
                    </div>

                    <p className='text-white font-light text-xl mt-4'>
                        Well Stimulation Competition challenges participants to <span className='font-semibold font-garamond italic text-[#E7C66B]'>innovate optimal solutions on the topic of well stimulation in the oil and gas sector</span>. They will engage in complex, <span className='font-semibold italic'>real-world scenarios</span> that will require them to devise effective well stimulation techniques to <span className='font-semibold italic'>optimize oil and gas production</span>.
                    </p>

                    <button className='absolute bottom-5 right-5 cursor-pointer w-max text-white glass px-7 py-3'>
                        <ArrowRight />
                    </button>
                </div>

                <div className='relative pb-20 glass px-5 py-3 flex flex-col'>
                    <div className='flex items-center gap-3'>
                        <img className='w-20 m-6' src={logoCaseStudy} alt="Case Study Logo" />

                        <div className='text-white'>
                            <p className='font-garamond text-3xl italic underline'>Case Study</p>
                            <p className='text-2xl font-light font-inter'>Competition</p>
                        </div>
                    </div>

                    <p className='text-white font-light text-xl mt-4'>
                        Case Study Competition challenges participants to <span className='font-semibold font-garamond italic text-[#E7C66B]'>analyze real-world oil and gas problems and develop innovative, practical solutions</span>. Teams will showcase their critical thinking and technical expertise through research, structured analysis, and compelling presentations.
                    </p>

                    <button className='absolute bottom-5 right-5 cursor-pointer w-max text-white glass px-7 py-3'>
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SeriesofCompetition