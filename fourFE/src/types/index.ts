interface IQuestion {
  words: IWord[]
}

interface IWord {
  word: string;
  [key: string]: string
}

interface IPhoto {
  url: string;
  [key: string]: string
}
export type { IQuestion, IPhoto }