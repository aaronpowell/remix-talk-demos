import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import type { GameModel, UserModel } from "types";
import { GameState } from "types";
import { ModelType } from "types";
import { getContainers, getGame, idGenerator } from "utils";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params["gameId"];

  if (!id) {
    redirect("/");
    return;
  }

  const { gameContainer } = getContainers();

  const game = await getGame(gameContainer, id);

  return json({ game });
};

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();
  const gameId = params["gameId"];

  const name = body.get("name");
  if (typeof name !== "string" || !gameId) {
    return json({}, { status: 400 });
  }

  const { gameContainer } = getContainers();

  const player: UserModel = {
    id: idGenerator(),
    modelType: ModelType.User,
    name,
    userDetails: name,
    userRoles: ["player"],
    identityProvider: "",
  };

  const game = await getGame(gameContainer, gameId);

  await gameContainer.items.upsert<GameModel>({
    ...game,
    players: [...game.players, player],
    state: GameState.Started,
  });

  return redirect(`/game/play/${gameId}/${player.id}`);
};

const JoinGame = () => {
  const { game } = useLoaderData<{ game: GameModel }>();
  const navigation = useNavigation();

  const isJoiningGame =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "join";
  return (
    <div>
      <h1>Join: {game.id}</h1>
      <Form action={`/game/join/${game.id}`} method="post">
        <fieldset disabled={isJoiningGame}>
          <label htmlFor="name">Player name:</label>
          <input type="text" name="name" id="name" placeholder="aaronpowell" />
        </fieldset>
        <fieldset disabled={isJoiningGame}>
          <button type="submit" name="_action" value="join">
            Join
          </button>
        </fieldset>
      </Form>
    </div>
  );
};

export default JoinGame;
