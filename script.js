/* get necessary already existing elements from DOM */
const quizOuter = document.querySelector('.quiz-outer');
const btnSubmit = document.querySelector('.submit');
const btnReset = document.querySelector('.reset');
const resultBox = document.querySelector('.results');
const headerBox = document.querySelector('.header');

function quizBuilder() {
  questionsList.forEach( (question, index) => {
    /* create elements to structure a card with quiz question, image, possible answers */
    const quizInner = document.createElement('div');
    const questionBox = document.createElement('div');
    const imageBox = document.createElement('img');
    const answersBoxList = document.createElement('ol');
    quizOuter.appendChild(quizInner);
    quizInner.appendChild(questionBox);
    quizInner.appendChild(imageBox);
    quizInner.appendChild(answersBoxList);

    /* add class with styles to each quiz question card */
    quizInner.setAttribute('class', 'quiz-inner');

    /* destructure values to get question, image, answers from each question object in array */
    const { questionText, questionImage, answersToQuestion, questionNumber } = question;

    /* insert question and image to new elements */
    questionBox.innerHTML= `<h4>Pytanie ${questionNumber} z ${questionsList.length}</h4><p>${questionText}</p>`;
    imageBox.src = questionImage;

    /* get possible answers looping the question objects, and insert them to DOM */
    for (letter in answersToQuestion) {
      const answersBoxListItem = document.createElement('li');
      answersBoxList.appendChild(answersBoxListItem);
      const answer = answersToQuestion[letter];
      answersBoxListItem.innerHTML = `<input type='radio' name='${questionNumber}' value='${letter}'
                                     id='${questionNumber}${letter}'>
                                     <label for='${questionNumber}${letter}'>${answer}</label>`
    }
  });
}

function markAnswered() {
  /* get necessary dynamically created input elements from DOM */
  const userInputsCollection = document.querySelectorAll('input[type="radio"]');
  const userAnswersArray = Array.from(userInputsCollection);

  /* add event listener to check which question is answered and change style */
  userAnswersArray.forEach(element => {
    element.addEventListener('click', () => {
      element.parentElement.parentElement.parentElement.classList.add('answered');
    });
  });
}

function getUserResult() {
  /* get necessary dynamically created input elements from DOM */
   const userInputsCollection = document.querySelectorAll('input[type="radio"]');
   const userAnswersArray = Array.from(userInputsCollection);

  /* create object for each user to keep his/her answers */
  const person = {};

  /* add checked answers (based on checked input) with question numbers (based on input name equal to question number) to user object as properties */
  userAnswersArray
      .filter(element => {
        return element.checked === true;
      })
      .forEach(element => person[element.name] = element.value);

  /* create variables with arrays to store user good, bad and missing answers */
  const goodAnswersArray = [];
  const badAnswersArray = [];
  const missingAnswersArray = [];

  /* verify if user answered given question and add to good or bad answers array */
  questionsList.forEach(element => {
    if (person.hasOwnProperty(element.questionNumber)) {
      if (person[element.questionNumber] == element.correct) {
        goodAnswersArray.push(element.questionNumber);
      } else {
        badAnswersArray.push(element.questionNumber);
      }
    } else {
      missingAnswersArray.push(element.questionNumber);
      badAnswersArray.push(element.questionNumber);
    }
  });

  /* change style to show good and bad answers without reference to user results */
  const corrNumbersLetters = questionsList.map(element => {
    return element.questionNumber + element.correct;
  });

  for (let i=0; i<userInputsCollection.length; i++) {
    if (corrNumbersLetters.includes(userInputsCollection[i].id) === true) {
      userInputsCollection[i].nextElementSibling.classList.add('good-answer');
    } else {
      userInputsCollection[i].nextElementSibling.classList.add('bad-answer');
    }
  }

  /* change style to block possibility of changing answers at this stage */
  for (let i=0; i<userInputsCollection.length; i++) {
    userInputsCollection[i].setAttribute("disabled", "true");
  }

  /* show result box after check answers button is clicked */
  resultBox.style.display='block';

  /* show reset button after check answers button is clicked */
  btnReset.style.display='block';

  /* create personalized messages depending on level of score */
  const messageStandard1 = `<h2>Twój wynik to ${goodAnswersArray.length} / ${badAnswersArray.length + goodAnswersArray.length}.</h2>`;
  const messageStandard2 = `<p></p>`;
  const messageStandard3 = `<p>Powyżej możesz przejrzeć swoje odpowiedzi i porównać z poprawnymi. Jeśli chcesz spróbować jeszcze raz, kliknij przycisk resetowania.</p>`;
  const messageHigh = `${messageStandard1}
                      <p> Imponujący wynik! Masz naprawdę aktualną wiedzę o świecie. Jak pokazuje H. Rosling ze współautorami w książce "Factfulness" z tymi pytaniami dużo większy problem mieli nie tylko zwykli ludzie, ale też naukowcy a nawet laureaci Nagrody Nobla. </p>
                      ${messageStandard2}${messageStandard3}`;
  const  messageMedium = `${messageStandard1}
                          <p>Nieźle, masz całkiem dobrą i dość aktualną wiedzę o świecie. Jak pokazuje H. Rosling ze współautorami w książce "Factfulness" z tymi pytaniami większy problem mieli zarówno zwykli ludzie, ale też naukowcy, a nawet laureaci Nagrody Nobla.</p>
                          ${messageStandard2}${messageStandard3}`;
  const messageLow = `${messageStandard1}
                      <p> No cóż – wynik nie jest wysoki. Ale – jak pokazuje H. Rosling ze współautorami w książce "Factfulness" – z tymi pytaniami podobny problem mieli nie tylko zwykli ludzie, ale także naukowcy, a nawet laureaci Nagrody Nobla.</p>
                      ${messageStandard2}${messageStandard3}`;

  /* check the level od user score: high, medium or low and insert proper message to DOM */
  const ratio = goodAnswersArray.length / (badAnswersArray.length + goodAnswersArray.length);
  if (ratio >= 0.7) {
    resultBox.innerHTML = messageHigh;
  } else if (ratio < 0.7 && ratio >= 0.5) {
    resultBox.innerHTML = messageMedium;
  } else {
    resultBox.innerHTML = messageLow;
  }

  /* move user to let him/her see results */
  resultBox.scrollIntoView();
}

function resetAnswers() {
  /* get necessary dynamically created input elements from DOM */
  const userInputsCollection = document.querySelectorAll('input[type="radio"]');

  /* change style to unblock possibility of changing answers if reset was made */
  for (let i=0; i<userInputsCollection.length; i++) {
    userInputsCollection[i].removeAttribute("disabled");
  }

  /* hide reset button afer reset button is clicked */
  btnReset.style.display='none';

  /* remove style corresponding to user answers */
  for (let i=0; i<userInputsCollection.length; i++) {
    userInputsCollection[i].checked=false;
    userInputsCollection[i].nextElementSibling.classList.remove('good-answer');
    userInputsCollection[i].nextElementSibling.classList.remove('bad-answer');
    userInputsCollection[i].parentElement.parentElement.parentElement.classList.remove('answered');
  }

  /* remove results from top page */
  resultBox.style.display='none';

  /* move user to top to start again */
  headerBox.scrollIntoView();
}

/* execute functions and listen for further events */
quizBuilder();
markAnswered();

btnSubmit.addEventListener('click', getUserResult);
btnReset.addEventListener('click', resetAnswers);
