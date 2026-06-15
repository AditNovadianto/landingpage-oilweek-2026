interface TimelineItemProps {
    month: string;
    date: string;
    title: string;
    color: string;
    icon: string;
    bg: string;
    reverse: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ month, date, title, color, icon, bg, reverse }) => {
    console.log(month, date, title, color, icon);
    return (
        <div className={`${reverse ? 'flex-row-reverse' : 'flex-row'} flex items-center w-full -rotate-3 mt-10`}>
            {/* LEFT: Month */}
            <div className="text-base text-nowrap md:text-lg lg:text-xl glass bg-transparent! px-3 md:px-20 lg:px-32 py-5 lg:py-10 font-inter font-light text-white">
                {month}
            </div>

            {/* RIGHT: Content */}
            <div
                className={`${reverse ? 'flex-row-reverse' : 'flex-row'} w-full overflow-hidden px-5 text-white font-semibold flex items-center justify-around gap-2 md:gap-4 lg:gap-5`}
                style={{
                    background: `linear-gradient(to ${reverse ? 'right' : 'left'}, ${color}, transparent)`
                }}
            >
                <p className="text-md md:text-3xl ld:text-4xl font-bold font-inter">{date}<span className="font-light text-base lg:text-2xl">th</span></p>

                <div className="flex items-center gap-2 md:gap-5">
                    <img src={icon} className="w-7 md:w-10 lg:w-14" />

                    <p className="text-base md:text-2xl lg:text-3xl font-inter font-semibold">{title}</p>
                </div>

                <img className="translate-y-5 w-10 md:w-14 lg:w-20" src={bg} alt="" />
            </div>
        </div>
    )
}

export default TimelineItem