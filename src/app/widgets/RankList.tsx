import { RankResDto } from "@/dto/rank.res.dto";
import Image from "next/image";
import { FunctionComponent } from "react";

interface RankListProps {
	list: RankResDto[];
}

const RankList: FunctionComponent<RankListProps> = ({ list }) => {

	return <section className={"mx-auto flex flex-col mt-5 w-full items-center"}>
		<p className={"text-3xl "}>- BEST PLAYERS -</p>
		<ul className={"flex flex-col mx-auto"}>
			{list.map((rank, index) => {
				return <li className="text-3xl flex items-center gap-8" key={rank.id}>
					{
						index < 3 &&
						<div><Image src={`/${index}_prize.png`} alt="rank" width={32} height={52} /></div>
					}
					<span className={"ml-auto"}>{rank.name}</span>
					<span className={"text-right"}>{rank.score.toLocaleString()}</span>
				</li>;
			})}

		</ul>
	</section>;
};

export default RankList;