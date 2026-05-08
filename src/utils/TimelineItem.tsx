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
            <div className="text-xl glass bg-transparent! px-32 py-10 font-inter font-light text-white">
                {month}
            </div>

            {/* RIGHT: Content */}
            <div
                className={`${reverse ? 'flex-row-reverse' : 'flex-row'} w-full overflow-hidden px-5 text-white font-semibold flex items-center justify-around gap-4`}
                style={{
                    background: `linear-gradient(to ${reverse ? 'right' : 'left'}, ${color}, transparent)`
                }}
            >
                <p className="text-4xl font-bold font-inter">{date}<span className="font-light text-2xl">th</span></p>

                <div className="flex items-center gap-5">
                    <img src={icon} className="w-14" />

                    <p className="text-3xl font-inter font-semibold">{title}</p>
                </div>

                <img className="translate-y-5 w-20" src={bg} alt="" />
            </div>
        </div>
    )
}

export default TimelineItem