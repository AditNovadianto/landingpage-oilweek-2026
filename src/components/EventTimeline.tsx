import TimelineItem from "../utils/TimelineItem"
import preEventBg from "../images/pre-event-bg.png"
import openRegistrationBg from "../images/open-registration-bg.png"
import closeRegistrationBg from "../images/close-registration-bg.png"
import preliminarySubmissionBg from "../images/preliminary-submission-bg.png"
import grandSeminarBg from "../images/grand-seminar-bg.png"
import companyVisitBg from "../images/company-visit-bg.png"
import fieldTripBg from "../images/field-trip-bg.png"
import jobFairBg from "../images/job-fair-bg.png"
import finalDayBg from "../images/final-day-bg.png"
import studentChapterBg from "../images/student-chapter-bg.png"
import galaDinnerBg from "../images/gala-dinner-bg.png"
import speCareBg from "../images/spe-care-bg.png"
import preEventLogo from "../images/pre-event-logo.png"
import openRegistrationLogo from "../images/open-registration-logo.png"
import closeRegistrationLogo from "../images/close-registration-logo.png"
import preliminarySubmissionLogo from "../images/preliminary-submission-logo.png"
import grandSeminarLogo from "../images/grand-seminar-logo.png"
import companyVisitLogo from "../images/company-visit-logo.png"
import fieldTripLogo from "../images/field-trip-logo.png"
import jobFairLogo from "../images/job-fair-logo.png"
import finalDayLogo from "../images/final-day-logo.png"
import studentChapterLogo from "../images/student-chapter-logo.png"
import galaDinnerLogo from "../images/gala-dinner-logo.png"
import speCareLogo from "../images/spe-care-logo.png"

const EventTimeline = () => {
    return (
        <div className="py-10 mt-32 min-h-screen">
            <p className="px-5 md:px-20 lg:px-32 -rotate-3 text-white font-light font-inter text-5xl">Event <span className="italic font-garamond font-semibold underline">Timeline</span></p>

            <div className="mt-14">
                <TimelineItem month="June" date="26" title="Pre-Event : Oil on Court" color="#F1944A" icon={preEventLogo} bg={preEventBg} reverse={false} />

                <TimelineItem month="July" date="26" title="Open Registration Competition" color="#25FCFF" icon={openRegistrationLogo} bg={openRegistrationBg} reverse={false} />

                <TimelineItem month="September" date="15" title="Close Registration Competition" color="#25FCFF" icon={closeRegistrationLogo} bg={closeRegistrationBg} reverse={false} />

                <TimelineItem month="September" date="16" title="Preliminary Submission" color="#25FCFF" icon={preliminarySubmissionLogo} bg={preliminarySubmissionBg} reverse={false} />

                <TimelineItem month="September" date="19" title="Grand Seminar X Skill Finder" color="#EF3538" icon={grandSeminarLogo} bg={grandSeminarBg} reverse={false} />

                <TimelineItem month="Sept - Oct" date="TBA" title="Company Visit" color="#EF35A0" icon={companyVisitLogo} bg={companyVisitBg} reverse={false} />

                <TimelineItem month="Sept - Oct" date="TBA" title="Field Trip" color="#A4A4A4" icon={fieldTripLogo} bg={fieldTripBg} reverse={true} />

                <TimelineItem month="October" date="7" title="Job Fair" color="#38A4D8" icon={jobFairLogo} bg={jobFairBg} reverse={true} />

                <TimelineItem month="October" date="31" title="Final Day Competition" color="#25FCFF" icon={finalDayLogo} bg={finalDayBg} reverse={true} />

                <TimelineItem month="October" date="31" title="Student Chapter Gathering" color="#25FCFF" icon={studentChapterLogo} bg={studentChapterBg} reverse={true} />

                <TimelineItem month="November" date="1" title="Gala Dinner" color="#E7C66B" icon={galaDinnerLogo} bg={galaDinnerBg} reverse={true} />

                <TimelineItem month="November" date="28" title="SPE Care" color="#25A4FF" icon={speCareLogo} bg={speCareBg} reverse={true} />
            </div>
        </div>
    )
}

export default EventTimeline