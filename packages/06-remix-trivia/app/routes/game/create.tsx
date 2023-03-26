import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { arrayRandomiser, getContainers, idGenerator } from "utils";
import type { GameModel, QuestionModel } from "types";
import { GameState, ModelType } from "types";

const CreateGame = () => {
  return (
    <div>
      <h1>Creating game...</h1>
    </div>
  );
};

export default CreateGame;

export const action: ActionFunction = async ({ request }) => {
  const { gameContainer, questionsContainer } = getContainers();
  const questions = await questionsContainer.items
    .query<QuestionModel>({
      query: "SELECT * FROM c",
    })
    .fetchAll();

  const newGame: GameModel = {
    id: idGenerator(),
    modelType: ModelType.Game,
    state: GameState.WaitingForPlayers,
    players: [],
    answers: [],
    questions: arrayRandomiser(questions.resources).slice(0, 10),
  };

  const gameResponse = await gameContainer.items.create(newGame);

  return redirect(`/game/join/${gameResponse.item.id}`);
};
