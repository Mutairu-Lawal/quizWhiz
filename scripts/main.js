const quizLinks = document.querySelectorAll(".js-subject-link");

quizLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    openQuizPage(e, link.querySelector("h5").innerHTML);
  });
});

document.querySelectorAll(".js-general-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    openQuizPage(e);
  });
});

function openQuizPage(e, quizType = "General knowledge") {
  e.preventDefault();
  let newQuestionName = quizType;
  assignValue(newQuestionName);
  saveData();
  open("quiz-page.html", "_self");
}

function assignValue(valueName) {
  newQuestion = valueName;
}

function saveData() {
  localStorage.setItem("quizWhiz-user-data", newQuestion);
}

const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;
