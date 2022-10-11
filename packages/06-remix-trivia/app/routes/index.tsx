export default function Index() {
  return (
    <div>
      <h1>Create a new game!</h1>
      <form action="/game/create" method="post">
        <button type="submit">Start a new game</button>
      </form>
    </div>
  );
}
