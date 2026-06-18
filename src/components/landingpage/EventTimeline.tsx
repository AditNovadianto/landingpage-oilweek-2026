// import TimelineItem from "../TimelineItem"
// import preEventBg from "../../images/pre-event-bg.png"
// import openRegistrationBg from "../../images/open-registration-bg.png"
// import closeRegistrationBg from "../../images/close-registration-bg.png"
// import preliminarySubmissionBg from "../../images/preliminary-submission-bg.png"
// import grandSeminarBg from "../../images/grand-seminar-bg.png"
// import companyVisitBg from "../../images/company-visit-bg.png"
// import fieldTripBg from "../../images/field-trip-bg.png"
// import jobFairBg from "../../images/job-fair-bg.png"
// import finalDayBg from "../../images/final-day-bg.png"
// import studentChapterBg from "../../images/student-chapter-bg.png"
// import galaDinnerBg from "../../images/gala-dinner-bg.png"
// import speCareBg from "../../images/spe-care-bg.png"
// import preEventLogo from "../../images/pre-event-logo.png"
// import openRegistrationLogo from "../../images/open-registration-logo.png"
// import closeRegistrationLogo from "../../images/close-registration-logo.png"
// import preliminarySubmissionLogo from "../../images/preliminary-submission-logo.png"
// import grandSeminarLogo from "../../images/grand-seminar-logo.png"
// import companyVisitLogo from "../../images/company-visit-logo.png"
// import fieldTripLogo from "../../images/field-trip-logo.png"
// import jobFairLogo from "../../images/job-fair-logo.png"
// import finalDayLogo from "../../images/final-day-logo.png"
// import studentChapterLogo from "../../images/student-chapter-logo.png"
// import galaDinnerLogo from "../../images/gala-dinner-logo.png"
// import speCareLogo from "../../images/spe-care-logo.png"
import timeline1 from "../../images/Timeline1.webp"
import timeline2 from "../../images/Timeline2.webp"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"

const EventTimeline = () => {
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            easing: "ease-in-out",
        });
    }, []);

    return (
        <div className="py-10 mt-32 min-h-screen">
            <p
                className="px-5 md:px-20 lg:px-32 -rotate-3 text-white font-light font-inter text-5xl"
                data-aos="fade-right"
            >
                Event{" "}
                <span className="italic font-garamond font-semibold gold-white-underline">
                    Timeline
                </span>
            </p>

            <div className="mt-10">
                <img src={timeline1} alt="" className="w-full" />

                <img src={timeline2} alt="" className="w-full" />

                {/* <div data-aos="fade-up" data-aos-delay="100">
                    <TimelineItem month="June" date="26" title="Pre-Event : Oil on Court" color="#F1944A" icon={preEventLogo} bg={preEventBg} reverse={false} />
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                    <TimelineItem month="July" date="26" title="Open Registration Competition" color="#25FCFF" icon={openRegistrationLogo} bg={openRegistrationBg} reverse={false} />
                </div>

                <div data-aos="fade-up" data-aos-delay="300">
                    <TimelineItem month="September" date="15" title="Close Registration Competition" color="#25FCFF" icon={closeRegistrationLogo} bg={closeRegistrationBg} reverse={false} />
                </div>

                <div data-aos="fade-up" data-aos-delay="400">
                    <TimelineItem month="September" date="16" title="Preliminary Submission" color="#25FCFF" icon={preliminarySubmissionLogo} bg={preliminarySubmissionBg} reverse={false} />
                </div>

                <div data-aos="fade-up" data-aos-delay="500">
                    <TimelineItem month="September" date="19" title="Grand Seminar X Skill Finder" color="#EF3538" icon={grandSeminarLogo} bg={grandSeminarBg} reverse={false} />
                </div>

                <div data-aos="fade-up" data-aos-delay="600">
                    <TimelineItem month="Sept - Oct" date="TBA" title="Company Visit" color="#EF35A0" icon={companyVisitLogo} bg={companyVisitBg} reverse={false} />
                </div>

                <div data-aos="fade-up" data-aos-delay="700">
                    <TimelineItem month="Sept - Oct" date="TBA" title="Field Trip" color="#A4A4A4" icon={fieldTripLogo} bg={fieldTripBg} reverse={true} />
                </div>

                <div data-aos="fade-up" data-aos-delay="800">
                    <TimelineItem month="October" date="7" title="Job Fair" color="#38A4D8" icon={jobFairLogo} bg={jobFairBg} reverse={true} />
                </div>

                <div data-aos="fade-up" data-aos-delay="900">
                    <TimelineItem month="October" date="31" title="Final Day Competition" color="#25FCFF" icon={finalDayLogo} bg={finalDayBg} reverse={true} />
                </div>

                <div data-aos="fade-up" data-aos-delay="1000">
                    <TimelineItem month="October" date="31" title="Student Chapter Gathering" color="#25FCFF" icon={studentChapterLogo} bg={studentChapterBg} reverse={true} />
                </div>

                <div data-aos="fade-up" data-aos-delay="1100">
                    <TimelineItem month="November" date="1" title="Gala Dinner" color="#E7C66B" icon={galaDinnerLogo} bg={galaDinnerBg} reverse={true} />
                </div>

                <div data-aos="fade-up" data-aos-delay="1200">
                    <TimelineItem month="November" date="28" title="SPE Care" color="#25A4FF" icon={speCareLogo} bg={speCareBg} reverse={true} />
                </div> */}
            </div>
        </div>
    )
}

export default EventTimeline