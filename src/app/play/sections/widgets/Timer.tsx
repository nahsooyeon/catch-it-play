"use client";

import { useCountdown } from "@/app/hooks/useTimer";

const TimerWidget = () => {
	const { isCountdown, count } = useCountdown(60);
	return (
		<div className={"bg-[#2ADCF9] w-full h-7"}>
			{isCountdown && <div
				style={{ width: `${(count / 60) * 100}%` }}
				className={"bg-black z-1"} />}
		</div>
	);
};

export default TimerWidget;