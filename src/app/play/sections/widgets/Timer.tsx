"use client";

import { useCountdownContext } from "@/app/context/Countdown";
import { cn } from "@/app/utils/tailwind";
import dayjs from "dayjs";
import { FunctionComponent, useRef } from "react";


const TimerWidget: FunctionComponent = () => {
	const progressBarRef = useRef<HTMLDivElement>(null);
	const { count, isCountdown } = useCountdownContext();
	

	
	return (
		<div className={"bg-[#2ADCF9] w-full h-7"}>
			{isCountdown &&
				<div className={"relative"}>
					<div
						ref={progressBarRef}
						style={{ width: `${((180000 - count) / 180000) * 100}%` }}
						className={"bg-black z-1 h-7 rounded-r-lg"} />
					<div
						style={{
							left: progressBarRef.current?.offsetWidth ? `${(progressBarRef.current.offsetWidth - 20) / 16}rem` : "0",
						}}
						className={cn("absolute z-10 bg-white lg:px-3 -bottom-5 lg:-bottom-8  shadow-bottom z-2 h-7 lg:h-10 rounded-lg flex flex-col items-center justify-center")}>
						{/* 삼각형 화살표 추가 */}
						<div className={"text-white absolute z-10 -top-4 left-1/3"}>▲</div>
						<div className={"text-base lg:text-lg"}>{dayjs(count).format("mm:ss:SSS")}</div>
					</div>
				</div>}
		</div>
	);
};

export default TimerWidget;