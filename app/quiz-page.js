import { comments } from './utils/comments.js';
import {
  hardQuestions,
  mathsQuestions,
  generalScience,
  englishQuestions,
  defaultQuestions,
  sports,
} from './data/questions.js';
import { stopTimer, checkTime, startTimer, clearData } from './utils/time.js';
// DOM Elements
const backBtn = document.querySelector('.js-back-btn');
const nextBtn = document.querySelector('.js-next-btn');
const navigationBtns = document.querySelectorAll('.js-navigation button');
const questionContainer = document.querySelector('.js-question-container');
// Quiz State
let subject = localStorage.getItem('quizWhiz-user-data') || 'General Knowledge';
const relatedQuestions = getRelatedQuestions();
const questions = generateRandomQuestion(relatedQuestions);
let currentQuestionIndex = 0;
const totalQuestions = questions.length;
const questionIndex = totalQuestions - 1;
let user = getCurrentUserData();
// when the page reload reset the user choices
resetUserChoice();
function getCurrentUserData() {
  const user = localStorage.getItem('userObject');
  return user
    ? JSON.parse(user)
    : {
        name: '',
        Question: [...questions],
        correct: [],
        incorrect: [],
        unanswered: [],
        grade: '',
        Comment: '',
        time: '',
        ['new-subject']: subject,
      };
}
// get the user name at first login
while (!user.name) {
  let userInput = prompt('Please enter your name:');
  // validating the userInput
  if (!userInput) {
    alert('Input cannot be empty. Please enter your name.');
  } else if (/^\d/.test(userInput)) {
    alert('Name cannot start with a number. Please try again.');
  } else {
    user.name = userInput;
    saveUserDetails();
  }
}
// render the question
renderQuestion();
function renderQuestion() {
  const activeIndex = currentQuestionIndex;
  let currentQuestion = questions[activeIndex];
  const quizType = subject;
  let {
    id,
    questionTag,
    options: { optionA, optionB, optionC, optionD },
    optionId: { optionAId, optionBId, optionCId, optionDId },
  } = currentQuestion;
  questionContainer.innerHTML = `
    <div class="display section min-sec">
      <div class="info">
        <h3>${quizType}</h3>
        <div class="page-no">
          <p>${currentQuestionIndex + 1} / ${totalQuestions}</p>
        </div>
      </div>
      <div class="question">
        <h3>${questionTag}</h3>
      </div>
    </div>
    <div class="options section js-options">
      <div class="divA">
        <input type="radio" id="${optionAId}" name="q-${id}" />
        <label for="${optionAId}">${optionA}</label>
      </div>
      <div class="divB">
        <input type="radio" id="${optionBId}" name="q-${id}" />
        <label for="${optionBId}">${optionB}</label>
      </div>
      <div class="divC">
        <input type="radio" id="${optionCId}" name="q-${id}" />
        <label for="${optionCId}">${optionC}</label>
      </div>
      <div class="divD">
        <input type="radio" id="${optionDId}" name="q-${id}" />
        <label for="${optionDId}">${optionD}</label>
      </div>
    </div>
  `;
  if (currentQuestionIndex === 0) {
    backBtn.classList.add('hidden');
  } else {
    backBtn.classList.remove('hidden');
    backBtn.innerHTML = 'Back';
  }

  // add event listener to all the input label
  getAllOptions();

  // time the timer
  startTimer();

  if (!questions[currentQuestionIndex].hasView) {
    questions[currentQuestionIndex].hasView = true;
  }
  if (questions[currentQuestionIndex].choice !== null) {
    const currentQuestionChoice = document.querySelector(
      `#${questions[currentQuestionIndex].choice}`
    );
    currentQuestionChoice.checked = true;
  }
}
navigationBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.innerHTML === 'Next') {
      currentQuestionIndex++;
      renderQuestion();
      let nextIndex = currentQuestionIndex;
      if (nextIndex++ === questionIndex) {
        btn.classList.add('hidden');
      }
    } else if (btn.innerHTML === 'Back') {
      currentQuestionIndex--;
      renderQuestion();
      if (currentQuestionIndex < questionIndex) {
        nextBtn.classList.remove('hidden');
        nextBtn.innerHTML = 'Next';
      }
    } else if (btn.innerHTML === 'Submit' || btn.innerHTML === 'Finish') {
      stopTimer();
      let hasViewedAll;
      let userRespond;

      // checking if all questions has been attended to
      for (let index = 0; index < totalQuestions; index++) {
        if (questions[index].hasView === false) {
          hasViewedAll = false;
          break;
        }
        hasViewedAll = true;
      }

      if (!hasViewedAll) {
        userRespond = confirm(
          'You still have unanswered questions\nAre you sure?\nokay=yes\ncancel=No'
        );
      } else {
        userRespond = confirm('Are you sure you want to submit?');
      }

      if (userRespond) {
        stopTimer();
        checkTime(user);
        renderResult();
      } else {
        startTimer();
      }
    }
  });
});
function renderResult() {
  var _a;
  const today = dayjs();
  const date = today.format('MMMM DD, YYYY');
  calculateResult();
  let { correct, incorrect, unanswered, grade, Comment, name, time } = user;
  const scored = correct.length;
  const missed = incorrect.length;
  const blank = unanswered.length;

  document.body.innerHTML = `
    <div class="result-container">
      <div class="completed-div">
        <p class="padding-left text-center">Thank you for completing this quiz.</p>
      </div>
      <div class="certificate-div">
        <div class="certificate-frame">
          <img
            src="images/certificate-images/certificate.webp"
            alt="certificate png"
          />
          <div class="detail">
            <h3 class="certificate-heading">Certificate of Achievement</h3>
            <p class="bold user-name">${name}</p>
            <p>Got a Score of</p>
            <p>${scored}/${totalQuestions} (${grade}%)</p>
            <p>On</p>
            <p class="bold subject-title">${subject} Quiz</p>
            <p>${date}</p>
          </div>
          <div class="medal">
            <img src="images/certificate-images/medal.webp" alt="medal image" />
          </div>
        </div>
      </div>
      <div class="result-details-container">
        <p class="padding-left">Your score :</p>
        <div class="results-container">
          <div class="result-content">
            <div class="title border-top">
              <p>Scores</p>
            </div>
            <div class="details">
              <p>${scored} / ${totalQuestions}</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Correct Answers</p>
            </div>
            <div class="details">
              <p>${scored}</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Incorrect Answers</p>
            </div>
            <div class="details">
              <p>${missed}</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Unanswered</p>
            </div>
            <div class="details">
              <p>${blank}</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Required passing Grade</p>
            </div>
            <div class="details">
              <p>50 %</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Grade</p>
            </div>
            <div class="details">
              <p>${grade} %</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Comment</p>
            </div>
            <div class="details">
              <p>${Comment}</p>
            </div>
          </div>
          <div class="result-content">
            <div class="title">
              <p>Time Taken</p>
            </div>
            <div class="details">
              <p>${time}</p>
            </div>
          </div>
        </div>
        <div class="btn-container">
          <button class="view-answer-btn">View Answers</button>
        </div>
      </div>
    </div>
    `;
  (_a = document.querySelector('button'))?.addEventListener('click', () => {
    open('answers-page.html', '_self');
    // location.reload();
  });
  saveUserDetails();
  clearData();
}
function calculateResult() {
  questions.forEach((question, index) => {
    const { choice, answerId } = question;
    if (choice) {
      if (choice === answerId) {
        user.correct.push(index);
      } else {
        user.incorrect.push(index);
      }
    } else {
      user.unanswered.push(index);
    }
  });

  user.grade = (user.correct.length / totalQuestions) * 100;
  const { grade } = user;

  user.Comment =
    grade <= 9
      ? comments[0]
      : grade <= 19
      ? comments[1]
      : grade <= 29
      ? comments[2]
      : grade <= 34
      ? comments[3]
      : grade <= 39
      ? comments[4]
      : grade <= 44
      ? comments[5]
      : grade <= 49
      ? comments[6]
      : grade <= 54
      ? comments[7]
      : grade <= 59
      ? comments[8]
      : grade <= 64
      ? comments[9]
      : grade <= 69
      ? comments[10]
      : grade <= 74
      ? comments[11]
      : grade <= 79
      ? comments[12]
      : grade <= 84
      ? comments[13]
      : grade <= 89
      ? comments[14]
      : grade <= 92
      ? comments[15]
      : grade <= 95
      ? comments[16]
      : grade <= 98
      ? comments[17]
      : comments[18];
}
function getAllOptions() {
  const options = document.querySelectorAll("input[type='radio']");
  options.forEach((option) => {
    option.addEventListener('click', (e) => {
      let selectedId = e.target.id;
      questions[currentQuestionIndex].choice = selectedId;
    });
  });
}
function saveUserDetails() {
  localStorage.setItem('userObject', JSON.stringify(user));
}
function getRelatedQuestions() {
  switch (subject) {
    case 'Hard Mode':
      return hardQuestions;
    case 'Mathematics':
      return mathsQuestions;
    case 'Science':
      return generalScience;
    case 'English':
      return englishQuestions;
    case 'Sport':
      return sports;
    default:
      return defaultQuestions;
  }
}
function uniqueArray(totalQuestions, arrayLength) {
  let arr = [];
  while (arr.length < totalQuestions) {
    const randNum = Math.floor(Math.random() * arrayLength);
    if (!arr.includes(randNum)) {
      arr.push(randNum);
    }
  }
  return arr;
}
function generateRandomQuestion(questionType) {
  const numbers = uniqueArray(10, questionType.length);
  let arr = [];
  numbers.forEach((number) => {
    const question = questionType[number];
    arr.push(JSON.parse(JSON.stringify(questionType[number])));
  });
  return arr;
}
function resetUserChoice() {
  user = {
    ...user,
    incorrect: [],
    correct: [],
    unanswered: [],
    Question: [...questions],
  };

  saveUserDetails();
}

// let sameQuestion = [];

// for (let i = 0; i < defaultQuestions.length; i++) {
//   const currentQuestion = defaultQuestions[i].questionTag;
//   let count = 0;
//   defaultQuestions.forEach((q) => {
//     // q.questionTag === currentQuestion && (count += 1);
//   });
// }
