import type { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "fs/promises";
import { Question } from "../../Question";
import { resolve } from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Question>
) {
  const data = await readFile(resolve("./public", "./trivia.json"));
  const { questions } = JSON.parse(data.toString());

  const rand = (max: number) => Math.floor(Math.random() * max);
  const index = rand(questions.length);
  const question = questions[index];
  res.status(200).json({
    ...question,
    answers: [...question.incorrect_answers, question.correct_answer].sort(
      () => rand(2) - 1
    ),
  });
}
