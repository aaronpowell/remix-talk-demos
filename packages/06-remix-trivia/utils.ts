import type { Container } from "@azure/cosmos";
import { CosmosClient } from "@azure/cosmos";
import type { GameModel} from "types";
import { ModelType } from "types";

export const arrayRandomiser = <T>(array: T[]) =>
  array.sort(() => 0.5 - Math.random());

export const idGenerator = () => {
  const chars = "qwertyuioplkjhgfdsazxcvbnm";

  let code = "";

  for (let i = 0; i < 4; i++) {
    const random = Math.floor(Math.random() * chars.length);
    code += chars[random];
  }

  return code;
};

export const getContainers = () => {
  if (
    !process.env.COSMOS_CONNECTION_STRING ||
    !process.env.DB_NAME ||
    !process.env.QUESTION_CONTAINER_NAME ||
    !process.env.GAME_CONTAINER_NAME
  ) {
    throw new Error("Cosmos data not setup");
  }

  const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);

  const db = client.database(process.env.DB_NAME);

  return {
    questionsContainer: db.container(process.env.QUESTION_CONTAINER_NAME),
    gameContainer: db.container(process.env.GAME_CONTAINER_NAME),
  };
};

export async function getGame(gameContainer: Container, id: string) {
  const res = await gameContainer.items
    .query<GameModel>({
      query: "SELECT * FROM c WHERE c.modelType = @type AND c.id = @id",
      parameters: [
        { name: "@type", value: ModelType.Game },
        { name: "@id", value: id },
      ],
    })
    .fetchAll();

  return res.resources[0];
}
