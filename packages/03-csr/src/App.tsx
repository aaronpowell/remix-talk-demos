import React, { useEffect, useState } from "react";
import "./App.css";
import { Loading } from "./Loading";

type Question = {
  id: number;
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
  answers: string[];
};

const rand = (max: number) => Math.floor(Math.random() * max);

function App() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const getQuestions = async () => {
      const res = await fetch("/trivia.json");
      const data = await res.json();
      setQuestions(data.questions);
    };
    getQuestions();
  }, []);

  const pickQuestion = () => {
    if (questions) {
      const index = rand(questions.length);
      const question = questions[index];
      setCurrentQuestion({
        ...question,
        answers: [...question.incorrect_answers, question.correct_answer].sort(
          () => rand(2) - 1
        ),
      });
      setCurrentAnswer(null);
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    pickQuestion();
  }, [questions]);

  const checkAnswer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQuestion && currentAnswer) {
      setIsCorrect(currentQuestion.correct_answer === currentAnswer);
    }
  };

  if (!currentQuestion) {
    return <Loading />;
  }

  return (
    <>
      <h1>It's trivia time!</h1>
      <section role="main">
        <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></h2>
        <form>
          <ul>
            {currentQuestion.answers.map((answer) => (
              <li key={answer}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={answer}
                    onChange={(e) =>
                      e.target.checked
                        ? setCurrentAnswer(e.target.value)
                        : setCurrentAnswer(null)
                    }
                  />
                  <span dangerouslySetInnerHTML={{ __html: answer }}></span>
                </label>
              </li>
            ))}
          </ul>
          <button type="submit" onClick={checkAnswer}>
            Check your answer
          </button>
        </form>

        {isCorrect !== null && (
          <div>
            <p>
              You are{" "}
              <span className={isCorrect ? "right" : "wrong"}>
                {isCorrect ? "right" : "wrong"}
              </span>
              .
            </p>
            <a href="#" onClick={pickQuestion}>
              Play again?
            </a>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
