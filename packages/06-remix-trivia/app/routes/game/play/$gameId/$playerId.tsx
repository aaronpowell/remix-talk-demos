import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { GameState } from "types";
import { arrayRandomiser, getContainers, getGame, idGenerator } from "utils";

type LoaderData = {
  question: {
    question: string;
    answers: string[];
    id: string;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const gameId = params["gameId"];
  const playerId = params["playerId"];

  if (!gameId || !playerId) {
    return redirect("/");
  }

  const { gameContainer } = getContainers();

  const game = await getGame(gameContainer, gameId);

  const question = game.questions
    .filter(
      (q) =>
        !game.answers.some(
          (a) => a.questionId === q.id && a.userId === playerId
        )
    )
    .map((q) => ({
      question: q.question,
      answers: arrayRandomiser([...q.incorrect_answers, q.correct_answer]),
      id: q.id,
    }))[0];

  if (!question) {
    await gameContainer.items.upsert({ ...game, state: GameState.Completed });
    return redirect(`/game/end/${gameId}/${playerId}`);
  }

  return json({
    question,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();

  const answer = body.get("answer");
  const questionId = body.get("questionId");

  if (typeof answer !== "string" || typeof questionId !== "string") {
    return json({}, 400);
  }

  const gameId = params["gameId"];
  const userId = params["playerId"];

  if (!gameId || !userId) {
    return redirect("/");
  }

  const { gameContainer } = getContainers();

  const game = await getGame(gameContainer, gameId);

  await gameContainer.items.upsert({
    ...game,
    answers: [
      ...game.answers,
      {
        id: idGenerator(),
        userId,
        questionId,
        answer,
      },
    ],
  });

  return null;
};

const PlayGame = () => {
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  const navigation = useNavigation();

  const isSubmittingAnswer =
    navigation.state === "submitting" &&
    navigation.formData.get("_action") === "submitAnswer";
  return (
    <div>
      <h1>Playing {params["gameId"]}</h1>
      <h2 dangerouslySetInnerHTML={{ __html: data.question.question }}></h2>
      <Form method="post">
        <input type="hidden" value={data.question.id} name="questionId" />
        <fieldset disabled={isSubmittingAnswer}>
          <ul>
            {data.question.answers.map((a) => {
              return (
                <li key={a}>
                  <label>
                    <input type="radio" name="answer" value={a} />
                    &nbsp;<span dangerouslySetInnerHTML={{ __html: a }}></span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button
          type="submit"
          name="_action"
          value="submitAnswer"
          disabled={isSubmittingAnswer}
        >
          {isSubmittingAnswer ? "Submitting..." : "Submit Answer"}
        </button>
      </Form>
    </div>
  );
};

export default PlayGame;
