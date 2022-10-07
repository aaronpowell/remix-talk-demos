import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { Question } from "../Question";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const getQuestions = async () => {
      const res = await fetch("/api/question");
      const data = await res.json();
      setCurrentQuestion(data);
    };
    if (currentQuestion === null) {
      getQuestions();
    }
  }, [currentQuestion]);

  const checkAnswer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQuestion && currentAnswer) {
      setIsCorrect(currentQuestion.correct_answer === currentAnswer);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Trivia App - Next.js style</title>
        <meta name="description" content="Trivia App - Next.js style" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.root}>
        {!currentQuestion && <Loading />}
        {currentQuestion && (
          <>
            <h1>It's trivia time!</h1>
            <section role="main">
              <h2
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              ></h2>
              <form>
                <ul className={styles.list}>
                  {currentQuestion.answers.map((answer) => (
                    <li key={answer} className={styles.listItem}>
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
                        <span
                          dangerouslySetInnerHTML={{ __html: answer }}
                        ></span>
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
                    <span className={isCorrect ? styles.right : styles.wrong}>
                      {isCorrect ? "right" : "wrong"}
                    </span>
                    .
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentAnswer(null);
                      setIsCorrect(null);
                      setCurrentQuestion(null);
                    }}
                  >
                    Play again?
                  </a>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
