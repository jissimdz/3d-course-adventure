
export interface ImageOption {
  image: string;
  alt: string;
  isCorrect: boolean;
}

export interface TextOption {
  text: string;
  isCorrect: boolean;
}

export interface ImageQuestion {
  id: number;
  question: string;
  options: ImageOption[];
}

export interface TextQuestion {
  id: number;
  question: string;
  options: TextOption[];
}

export interface QuizSeries {
  id: string;
  name: string;
  imageQuestions: ImageQuestion[];
  textQuestions: TextQuestion[];
}
