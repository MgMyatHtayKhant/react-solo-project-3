import { useState } from "react";
import {decode} from 'html-entities';
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [check, setCheck] = useState(false);
  
  let score = 0;
  
  console.log("Running!", check);

  async function callingApi() {
    console.log("Calling Api");
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple");
      const data = await response.json();
      setQuestions(data.results.map(question => ({
        ...question,
        answers: shuffle([question.correct_answer, ...question.incorrect_answers]),
        chooseId: ""
      })));
      check &&  setCheck(false);
    } catch (error) {
      console.log(error);
    }
  }


  console.log(questions);

  function handleChoose(questionIndex, answerIndex) {
    setQuestions(prevQuestions => prevQuestions.map((question, index) => (
      questionIndex === index ? {...question, chooseId: answerIndex} : question
    )))
  }

  const elements = questions.map((question, index) => (
    <div key={index} className="question">
      <p className="question-text">{decode(question.question)}</p>
      <div className={`answer ${check ? 'check' : ''}`}>
      {
        check ? (question.answers.map((answer, i) => {
          score = score + 
          (i === question.chooseId && answer === question.correct_answer ? 1 : 0);
          return <button 
          key={i} 
          className={"answer-btn" + 
           (i === question.chooseId ? " selected" : "") + 
           (answer === question.correct_answer ? " corrected" : "")}>
           {decode(answer)}
         </button>
        }
        )) : (
          question.answers.map((answer, i) => (
            <button 
            onClick={() => handleChoose(index, i)}
             key={i} 
             className={"answer-btn " + (i === question.chooseId ? "selected" : "")}>
              {decode(answer)}
            </button>
          ))
        )
      }
      </div>
    </div>
  ))

  return (
    <>
      <main className="container">
        {questions.length > 0 ? (
          <div className="questions-page">
            {elements}
            <div className={check ? "check-container checked" : "check-container"}>
              {check && <p className="score-description">You score {score}/5 correct answers</p>}
            <button onClick={() =>  check ? callingApi() : setCheck(true)} className="btn question-btn">
              {check ? "Play again" : "Check answers"}
            </button>
            </div>
          </div>
        ) : (
          <div className="intro-page">
            <h1 className="title">Quizzical</h1>
            <p className="description">Some description if needed</p>
            <button onClick={callingApi} className="btn start-btn">Start quiz</button>
          </div>
        )}
      </main>
    </>
  );
}

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] =  [array[randomIndex], array[currentIndex]] 
  }
  return array;
}

export default App;
