// select all links
const quizLinks = document.querySelectorAll('.js-subject-link');
const thisYear = document.querySelector('#current-year') as HTMLSpanElement;
// set the year
const currentYear = new Date().getFullYear();
thisYear.textContent = currentYear.toString();

// add eventlistener for page routing
quizLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const quizName = link.querySelector('p')?.innerHTML;
    if (quizName) openQuizPage(e, quizName);
  });
});

document.querySelectorAll('.js-general-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    openQuizPage(e);
  });
});

function openQuizPage(e: Event, quizType = 'General knowledge') {
  e.preventDefault();
  let newQuestionName = quizType;
  saveData(newQuestionName);
  open('quiz-page.html', '_self');
}

function saveData(value: string) {
  localStorage.setItem('quizWhiz-user-data', value);
}
