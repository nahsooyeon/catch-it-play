export interface BoardResDto {
  seed: string;
  grid: string[][];
  gridsize: {
    x: number;
    y: number;
  };
  wordlist: string[];
  words: wordType[];
}

type wordType = {
  word: string;
  direction: number;
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};
