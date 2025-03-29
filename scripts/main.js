"use strict";
// select all links
const quizLinks = document.querySelectorAll('.js-subject-link');
const thisYear = document.querySelector('#current-year');
// set the year
const currentYear = new Date().getFullYear();
thisYear.textContent = currentYear.toString();
// add eventlistener for page routing
quizLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        var _a;
        const quizName = (_a = link.querySelector('p')) === null || _a === void 0 ? void 0 : _a.innerHTML;
        if (quizName)
            openQuizPage(e, quizName);
    });
});
document.querySelectorAll('.js-general-link').forEach((link) => {
    link.addEventListener('click', (e) => {
        openQuizPage(e);
    });
});
function openQuizPage(e, quizType = 'General knowledge') {
    e.preventDefault();
    let newQuestionName = quizType;
    saveData(newQuestionName);
    open('quiz-page.html', '_self');
}
function saveData(value) {
    localStorage.setItem('quizWhiz-user-data', value);
}
