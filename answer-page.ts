import { UserData } from './types/types';

const displayName = document.querySelector(
  '.js-quiz-type'
) as HTMLHeadingElement;
const questionsContainer = document.querySelector(
  '.js-questions-container'
) as HTMLDivElement;
let html = '';

const getCurrentUserData: () => UserData = () => {
  const user = localStorage.getItem('userObject');
  return user && JSON.parse(user);
};

// const userDetails = JSON.parse(localStorage.getItem('userObject'));
const userDetails = getCurrentUserData();

let { time, Question, ['new-subject']: newSubject, incorrect } = userDetails;

const correctArray: HTMLDivElement[] = [];
const incorrectArray: HTMLDivElement[] = [];
const questionName = newSubject;
const totalQuestion = Question.length;
const questions = Question;

displayName.innerHTML = `${questionName} Result`;
questionsContainer.innerHTML = renderQuestion();

const questionContainer = document.querySelectorAll('.js-question-container');

for (let i = 0; i < questions.length; i++) {
  const { answerId, choice } = questions[i];
  let inputs = questionContainer[i].querySelectorAll('input');

  inputs.forEach((input) => {
    if (input.id === answerId) {
      correctArray.push(input.parentNode as HTMLDivElement);
    }
  });

  if (choice) {
    let checkedInput = document.querySelector(
      `#${questions[i].choice}`
    ) as HTMLInputElement;

    checkedInput.checked = true;

    if (checkedInput.id !== answerId) {
      incorrectArray.push(checkedInput.parentNode as HTMLDivElement);
    }
  }
}

function renderQuestion() {
  let html = '';

  questions.forEach((question, index) => {
    const {
      questionTag,
      options: { optionA, optionB, optionC, optionD },
      optionId: { optionAId, optionBId, optionCId, optionDId },
      choice,
      answerId,
      feedback,
      id,
    } = question;

    if (choice) {
      if (choice === answerId) {
        html += `
    <div class="question-container js-question-container">
          <div class="question-number"><p>Question ${
            index + 1
          } / ${totalQuestion}</p></div>
          <div class="question-content">
            <div class="question-tag">
              <h4>${questionTag}</h4>
            </div>
            <div class="options section options-container js-option-container">
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
          </div>
          <div class="feedback-container">
            <div class="comment-section">
            <i class="fa-solid fa-circle-check"></i>
              <p class='green'> Correct </p>
            </div>
            <div class="feedback">
              <h4>Feedback</h4>
              <p>
                ${feedback}
              </p>
            </div>
          </div>
        </div>
    `;
      } else {
        html += `
    <div class="question-container js-question-container">
          <div class="question-number"><p>Question ${
            index + 1
          } / ${totalQuestion}</p></div>
          <div class="question-content">
            <div class="question-tag">
              <h4>${questionTag}</h4>
            </div>
            <div class="options section options-container js-option-container">
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
          </div>
          <div class="feedback-container">
            <div class="comment-section">
              <i class="fa-solid fa-circle-xmark"></i> <p class='red'> Incorrect! Keep working </p>
            </div>
            <div class="feedback">
              <h4>Feedback</h4>
              <p>
                ${feedback}
              </p>
            </div>
          </div>
        </div>
    `;
      }
    } else {
      html += `
    <div class="question-container js-question-container">
          <div class="question-number"><p>Question ${
            index + 1
          } / ${totalQuestion}</p></div>
          <div class="question-content">
            <div class="question-tag">
              <h4>${questionTag}</h4>
            </div>
            <div class="options section options-container js-option-container">
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
          </div>
          <div class="feedback-container">
            <div class="comment-section">
            <i class="fa-solid fa-circle-exclamation"></i>
              <p class='yellow'> Unanswered </p>
            </div>
            <div class="feedback">
              <h4>Feedback</h4>
              <p>
                ${feedback}
              </p>
            </div>
          </div>
        </div>
    `;
    }
  });

  return html;
}

correctArray.forEach((parent) => {
  parent.style.backgroundColor = '#008000';
  parent.style.color = '#fff';
  parent.style.border = '2px solid lightgreen';
  let lables = parent.querySelectorAll('label');

  lables.forEach((label) => {
    label.style.color = 'white';
  });
});

incorrectArray.forEach((parent) => {
  parent.style.backgroundColor = 'red';
  parent.style.color = '#fff';
  parent.style.border = '2px solid darkred';
  let lables = parent.querySelectorAll('label');

  lables.forEach((label) => {
    label.style.color = 'white';
  });
});
