export enum ModelType {
  Question = "Question",
  User = "User",
  UserAnswer = "UserAnswer",
  Game = "Game",
}

type Model = {
  id: string;
  modelType: ModelType;
};

export type QuestionModel = {
  question: string;
  category: string;
  incorrect_answers: string[];
  correct_answer: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
} & Model;

export type UserModel = {
  name: string;
  identityProvider: string;
  userDetails: string;
  userRoles: string[];
} & Model;

export type UserAnswerModel = {
  userId: string;
  questionId: string;
  answer: string;
} & Model;

export type GameModel = {
  state: GameState;
  players: UserModel[];
  questions: QuestionModel[];
  answers: UserAnswerModel[];
} & Model;

export enum GameState {
  WaitingForPlayers = "WaitingForPlayers",
  Started = "Started",
  Completed = "Completed",
}
