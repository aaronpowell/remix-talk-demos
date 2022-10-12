import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { arrayRandomiser, getContainers, getGame } from "utils";

type LoaderData = {
  answers: [
    {
      answer: string;
      question: string;
      correct: boolean;
      answers: string[];
    }
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const gameId = params.gameId;
  const playerId = params.playerId;

  if (!playerId || !gameId) {
    return redirect("/");
  }

  const { gameContainer } = getContainers();

  const game = await getGame(gameContainer, gameId);

  const answers = game.answers.filter((a) => a.userId === playerId);

  return json({
    answers: answers.map((a) => {
      const question = game.questions.find((q) => q.id === a.questionId);
      if (!question) {
        return null;
      }
      return {
        answer: a.answer,
        question: question.question,
        correct: a.answer === question.correct_answer,
        answers: arrayRandomiser([
          ...question.incorrect_answers,
          question.correct_answer,
        ]),
      };
    }),
  });
};

const EndGame = () => {
  const { answers } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Game over!</h1>
      {answers.map((a) => {
        return (
          <div key={a.question}>
            <h2 dangerouslySetInnerHTML={{ __html: a.question }}></h2>
            <ul>
              {a.answers.map((a) => (
                <li key={a} dangerouslySetInnerHTML={{ __html: a }}></li>
              ))}
            </ul>
            <p>
              Your answer was{" "}
              <span className={a.correct ? "right" : "wrong"}>
                {a.correct ? "right" : "wrong"}
              </span>
            </p>
          </div>
        );
      })}
      <Link to="/">Play again?</Link>
    </div>
  );
};

export default EndGame;
