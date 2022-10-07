import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Question } from "Question";
import { getRandomQuestion } from "~/utils.server";

type LoaderData = {
  question: Question;
};

export const loader: LoaderFunction = async () => {
  const question = await getRandomQuestion();

  return json<LoaderData>({ question }, { status: 200 });
};

export default function Index() {
  const { question } = useLoaderData<LoaderData>();
  return (
    <div className="root">
      <h1>It's trivia time!</h1>
      <section role="main">
        <h2 dangerouslySetInnerHTML={{ __html: question.question }}></h2>
        <Form method="post" action={`/question/${question.id}`}>
          <input type="hidden" value={question.id} name="questionId" />
          <ul>
            {question.answers.map((answer) => (
              <li key={answer}>
                <label>
                  <input type="radio" name="answer" value={answer} />
                  <span dangerouslySetInnerHTML={{ __html: answer }}></span>
                </label>
              </li>
            ))}
          </ul>
          <button type="submit">Check your answer</button>
        </Form>
      </section>
    </div>
  );
}
