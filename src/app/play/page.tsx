import ServerSideBoard from "./sections/ServerBoard";
import GameInfoWidget from "./sections/widgets/GameInfo";
import TimerWidget from "./sections/widgets/Timer";

const PlayPage = () => {
	return <main className={"bg-[#EDEDED] flex flex-col"}>
		<GameInfoWidget  />
		<TimerWidget />
		<ServerSideBoard />
	</main>;
};

export default PlayPage;