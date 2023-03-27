import { Form, useNavigation } from "@remix-run/react";

export default function Index() {
  const navigation = useNavigation();

  const isStartingGame =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "start";
  return (
    <div>
      <h1>Create a new game!</h1>
      <Form action="/game/create" method="post">
        <button
          type="submit"
          name="_action"
          value="start"
          disabled={isStartingGame}
        >
          {isStartingGame ? "Preparing game..." : "Start a new game"}
        </button>
      </Form>
    </div>
  );
}
