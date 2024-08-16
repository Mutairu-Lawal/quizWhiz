let timer = null;
let isRunning = false;
let [seconds, minutes, hours] = [0, 0, 0];

export function startTimer() {
  if (!isRunning) {
    timer = setInterval(stopwatch, 1000);
    isRunning = true;
  }
}

function stopwatch() {
  seconds++;
  if (seconds == 60) {
    seconds = 0;
    minutes++;
    if (minutes == 60) {
      minutes = 0;
      hours++;
    }
  }

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
}

export function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

export function checkTime(getUser) {
  if (hours !== "00") {
    getUser.time = `${hours} ${pluralize(hours, "hour")} ${minutes} ${pluralize(
      minutes,
      "minute"
    )} ${seconds} ${pluralize(seconds, "second")}`;
  } else if (minutes !== "00") {
    getUser.time = `${minutes} ${pluralize(
      minutes,
      "minute"
    )} ${seconds} ${pluralize(seconds, "second")}`;
  } else {
    getUser.time = `${seconds} ${pluralize(seconds, "second")}`;
  }
}

function pluralize(value, word) {
  return value <= "01" ? word : word + "s";
}

export function clearData() {
  localStorage.removeItem("quizWhiz-user-data");

  let timer = null;
  let isRunning = false;

  hours = 0;
  minutes = 0;
  seconds = 0;
}
