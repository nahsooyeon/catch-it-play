"use client";

import { GameInfoStore } from "@/app/store/GameInfo";
import { FunctionComponent } from "react";
import { useStore } from "zustand";


const GameInfoWidget: FunctionComponent = () => {
	const { level, points } = useStore(GameInfoStore);

	return <div className={"bg-primary gap-4 lg:gap-11 px-5 lg:px-10 py-5 w-full flex"}>
		<div className={"flex flex-col gap-1 items-center justify-center"}>
			<div
				className={"lg:size-20 h-5 p-5 bg-white shadow-bottom rounded-2xl flex items-center justify-center"}>
				<span className={"text-black text-3xl leading-6 font-normal text-center"}>{level}</span>
			</div>
			<p className={"text-base lg:text-2xl"}>Level</p>
		</div>
		<div className={"flex w-full flex-grow  flex-col gap-1 items-center justify-center"}>
			<div
				className={"lg:h-20 h-5 w-max shadow-bottom flex-grow bg-white p-5 rounded-2xl flex items-center justify-end"}>
				<div className={"text-black text-4xl leading-6 font-normal text-right"}>{(points).toLocaleString()}</div>
			</div>
			<p className={"text-base lg:text-2xl"}>Points</p>
		</div>
	</div>;
};

export default GameInfoWidget;