import heroImageAboutSPEUISC from '../images/heroImageAboutSPEUISC.png'

const AboutSPEUISC = () => {
    return (
        <div id='aboutspeuisc' className='px-5 md:px-20 lg:px-32 py-10 min-h-screen flex flex-col md:flex-row items-center gap-20 justify-between mt-10'>
            <img className='w-75' src={heroImageAboutSPEUISC} alt="About SPEUISC" />

            <div className='text-white text-left'>
                <p className='text-4xl lg:text-5xl font-inter font-light'>About <span className='italic font-garamond font-semibold'>SPE UI SC</span></p>

                <p className='mt-5 leading-7'>Society of Petroleum Engineers Universitas Indonesia Student Chapter (SPE UI SC) is a student chapter under SPE International focusing on the oil and gas energy sector. Established in 1999, SPE UI SC became the first recognized student department club of the Engineering Faculty and is also currently joined by members from the Mathematics and Natural Sciences.</p>

                <div className='flex flex-col xl:flex-row items-center gap-10 mt-10 justify-between'>
                    <div className='text-center w-full font-light text-xl glass px-10 py-2'>
                        <p>100+</p>
                        <p>Officers</p>
                    </div>

                    <div className='text-center w-full font-light text-xl glass px-10 py-2'>
                        <p>500+</p>
                        <p>Alumnae</p>
                    </div>

                    <div className='text-center w-full font-light text-xl glass px-10 py-2'>
                        <p>1200+</p>
                        <p>Members</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutSPEUISC