import { readFile } from "fs/promises";
import { resolve } from "path";
import type { Question } from "Question";

const rand = (max: number) => Math.floor(Math.random() * max);

export const getRandomQuestion: () => Promise<Question> = async () => {
  const data = await readFile(resolve("./public", "./trivia.json"));
  const { questions } = JSON.parse(data.toString());

  const index = rand(questions.length);
  const question = questions[index];

  return {
    ...question,
    answers: [...question.incorrect_answers, question.correct_answer].sort(
      () => rand(2) - 1
    ),
  } as Question;
};

export const getQuestionById: (id: number) => Promise<Question> = async (
  id: number
) => {
  const data = await readFile(resolve("./public", "./trivia.json"));
  const { questions } = JSON.parse(data.toString());

  console.log(id);

  const question = questions.find((q: Question) => q.id === id);

  return {
    ...question,
    answers: [...question.incorrect_answers, question.correct_answer].sort(
      () => rand(2) - 1
    ),
  } as Question;
};
