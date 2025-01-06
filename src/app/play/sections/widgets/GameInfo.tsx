"use client";

import { GameInfoStore } from "@/app/store/GameInfo";
import { FunctionComponent } from "react";
import { useStore } from "zustand";


const GameInfoWidget: FunctionComponent = () => {
	const { level, points } = useStore(GameInfoStore);

	return <div className={"bg-[#67939F] gap-4 md:gap-11 px-5 md:px-[52px] py-[38px] w-full flex"}>
		<div className={"flex flex-col gap-1 items-center justify-center"}>
			<div
				style={{
					boxShadow: '0px 7px 0px 0px rgba(0, 0, 0, 0.25)'
				}}
				className={"size-20 bg-white rounded-2xl flex items-center justify-center"}>
				<span className={"text-black text-3xl leading-6 font-normal text-center"}>{level}</span>
			</div>
			<p className={"text-base md:text-2xl"}>Level</p>
		</div>
		<div className={"flex w-full flex-grow  flex-col gap-1 items-center justify-center"}>
			<div
				style={{
					boxShadow: '0px 7px 0px 0px rgba(0, 0, 0, 0.25)'
				}}
				className={"h-20 w-full flex-grow bg-white md:px-10 px-5 rounded-2xl flex items-center justify-end"}>
				<div className={"text-black text-4xl leading-6 font-normal text-right"}>{(points).toLocaleString()}</div>
			</div>
			<p className={"text-base md:text-2xl"}>Points</p>
		</div>
	</div>;
};

export default GameInfoWidget;