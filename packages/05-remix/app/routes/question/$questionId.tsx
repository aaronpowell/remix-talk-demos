import { useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getQuestionById } from "~/utils.server";

type ActionData = {
  fields?: {
    question: string;
    answer: string;
    isCorrect: boolean;
    correctAnswer: string;
  };
  error?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const questionId = form.get("questionId");
  const answer = form.get("answer");

  if (typeof questionId !== "string" || typeof answer !== "string") {
    return badRequest({ error: "Bad parameters supplied" });
  }
  const question = await getQuestionById(parseInt(questionId, 10));

  return json<ActionData>(
    {
      fields: {
        question: question.question,
        answer: answer ?? "",
        isCorrect: question.correct_answer === answer,
        correctAnswer: question.correct_answer,
      },
    },
    { status: 200 }
  );
};

export default function Index() {
  const actionData = useActionData<ActionData>();

  if (actionData && actionData.fields) {
    return (
      <div className="root">
        <h1>Check your answer!</h1>
        <section role="main">
          <h2
            dangerouslySetInnerHTML={{ __html: actionData.fields.question }}
          ></h2>
          <p>
            You provided the answer: <strong>{actionData.fields.answer}</strong>
            .
          </p>
          <p>
            The correct answer is:{" "}
            <strong>{actionData.fields.correctAnswer}</strong>.
          </p>
          <p>
            This means that you were{" "}
            <span className={actionData.fields.isCorrect ? "right" : "wrong"}>
              {actionData.fields.isCorrect ? "right" : "wrong"}
            </span>
            .
          </p>
          <p>
            <a href="/">Play again?</a>
          </p>
        </section>
      </div>
    );
  }
}
