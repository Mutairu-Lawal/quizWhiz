import {
  hardQuestions,
  mathsQuestions,
  generalScience,
  englishQuestions,
  defaultQuestions,
  sports,
} from "../data/questions.js";

import { stopTimer, checkTime, startTimer, clearData } from "../utils/time.js";

const backBtn = document.querySelector(".js-back-btn");
const nextBtn = document.querySelector(".js-next-btn");
const navigationBtns = document.querySelectorAll(".js-navigation button");

const comments = [
  "Needs significant improve. Keep working on it!",
  "Below expectations. Try again with more effort.",
  "Not quite there yet. Keep practising and learning.",
  "Fair effort, but room for improvement. Keep pushing!",
  "Showing potential, but need more work. Stay focused!",
  "Getting closer, but still a bit off. Keep it up!",
  "Good try, but just shy of a pass. Keep going!",
  "Passing grade, but can do better. Keep improving!",
  "Average performance. Aim higher next time!",
  "Good effort, but can refine skills further. Keep it up!",
  "Solid performance! Building momentum, Keep going!",
  "Good job! Demonstrating a strong understanding.",
  "Excellent effort! Consistently delivering quality work.",
  "Outstanding performance! Showing mastery of skills.",
  "Impressive achievement! Exceeding expectations.",
  "Exception performance! Demonstrating expertise.",
  "Outstanding achievement! Showcasing mastery.",
  "Phenomenal work! Exceeding expectations",
  "Perfect score! Flawless performance",
];

let subject = localStorage.getItem("quizWhiz-user-data") || "General Knowledge";

let relatedQuestions;

switch (subject) {
  case "Hard Mode":
    relatedQuestions = hardQuestions;
    break;
  case "Mathematics":
    relatedQuestions = mathsQuestions;
    break;
  case "Science":
    relatedQuestions = generalScience;
    break;
  case "English":
    relatedQuestions = englishQuestions;
    break;
  case "Sport":
    relatedQuestions = sports;
    break;
  default:
    relatedQuestions = defaultQuestions;
}

let randomQuestions = generateRandomQuestion(relatedQuestions);

let questions = randomQuestions;

let i = 0;
const totalQuestion = questions.length;
const questionIndex = questions.length - 1;

let user = {
  userName: "Guest",
  Question: [...questions],
  correct: [],
  incorrect: [],
  unanswered: [],
  grade: "",
  Comment: "",
  time: null,
  ["new-subject"]: subject,
};

renderQuestion();

navigationBtns.forEach((btn) => {
  btn.addEventListener("click", (index) => {
    if (btn.innerHTML === "Next") {
      i++;
      renderQuestion();

      let nextIndex = i;
      if (nextIndex++ === questionIndex) {
        btn.innerHTML = "Finish";
      }
    } else if (btn.innerHTML === "Back") {
      i--;
      renderQuestion();
      if (i < questionIndex) {
        nextBtn.innerHTML = "Next";
      }
    } else if (btn.innerHTML === "Submit" || btn.innerHTML === "Finish") {
      stopTimer();

      let viewedAll;
      let respond;

      for (index = 0; index < questions.length; index++) {
        const currentIndex = index;
        const num = currentIndex + 1;

        if (questions[index].hasView === false) {
          viewedAll = false;
          break;
        }

        viewedAll = true;
      }

      if (!viewedAll) {
        respond = confirm(
          "You still have unanswered questions\nAre you sure?\nokay=yes\ncancel=No"
        );
      } else {
        respond = confirm("Are you sure you want to submit?");
      }

      if (respond) {
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
  const today = dayjs();
  const date = today.format("MMMM DD, YYYY");
  calculateResult();

  let { correct, incorrect, unanswered, grade, Comment, userName, time } = user;

  const scored = correct.length;
  const missed = incorrect.length;
  const blank = unanswered.length;

  document.body.innerHTML = `<div class="main-container">
      <div class="completed-div">
        <p class="padding-left">Thank you for completing this quiz.</p>
      </div>
      <div class="certificate-div">
        <div class="certificate-frame">
          <img
            src="images/certificate-images/—Pngtree—luxury golden rectangle corner certificate_9168212.png"
            alt="certificate png"
          />
          <div class="detail">
            <h3 class="certificate-heading">Certificate of Achievement</h3>
            <p class="bold">${userName}</p>
            <p>Got a Score of</p>
            <p>${scored}/${totalQuestion} (${grade}%)</p>
            <p>On</p>
            <p class="bold">${subject} Quiz</p>
            <p>${date}</p>
          </div>
          <div class="medal">
            <img src="images/certificate-images/medal.png" alt="medal image" />
          </div>
        </div>
      </div>
      <div class="result-details-container">
        <p class="padding-left">Your score</p>
        <div class="result-container">
          <div class="result-content">
            <div class="title">
              <p>Score</p>
            </div>
            <div class="details">
              <p>${scored} / ${totalQuestion}</p>
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
    </div>`;

  document.querySelector("button").addEventListener("click", () => {
    open("result-page.html", "_blank");
    location.reload();
  });

  saveUserDetails();
  clearData();
}

function calculateResult() {
  questions.forEach((question, index) => {
    const { choice, answerId, unanswered } = question;

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

  user.grade = (user.correct.length / totalQuestion) * 100;

  let { grade } = user;

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

function renderQuestion() {
  const activeIndex = i;
  let pickedQuestion = questions[activeIndex];
  const quizType = subject;

  let {
    id,
    questionTag,
    options: { optionA, optionB, optionC, optionD },
    optionId: { optionAId, optionBId, optionCId, optionDId },
    answerId,
    hasView,
    choice,
    feedback,
  } = pickedQuestion;

  document.querySelector(
    ".js-question-container"
  ).innerHTML = `<div class="display section min-sec">
          <div class="info">
            <h3>${quizType}</h3>
            <div class="page-no">
              <p>${i + 1} / ${totalQuestion}</p>
            </div>
          </div>
          <div class="question">
            <h3>
              ${questionTag}
            </h3>
          </div>
        </div>
        <div class="options section">
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
        </div>`;

  if (i === 0) {
    backBtn.innerHTML = "Submit";
  } else {
    backBtn.innerHTML = "Back";
  }

  getAllOptions();

  if (!questions[i].hasView) {
    questions[i].hasView = true;
  }

  startTimer();

  if (questions[i].choice !== null) {
    document.querySelector(`#${questions[i].choice}`).checked = true;
  }
}

function getAllOptions() {
  const options = document.querySelectorAll("input[type='radio']");

  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      let selectedId = e.target.id;

      questions[i].choice = selectedId;
    });
  });
}

function uniqueArray(totalQuestion, arrayLength) {
  let arr = [];

  while (arr.length < totalQuestion) {
    const randNum = Math.floor(Math.random() * arrayLength);
    if (!arr.includes(randNum)) {
      arr.push(randNum);
    }
  }

  return arr;
}

function generateRandomQuestion(questionType) {
  const numbers = uniqueArray(20, questionType.length);

  let arr = [];

  numbers.forEach((number) => {
    const question = questionType[number];
    arr.push(JSON.parse(JSON.stringify(questionType[number])));
  });

  return arr;
}

function saveUserDetails() {
  localStorage.setItem("user-details", JSON.stringify(user));
}
