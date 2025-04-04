import { UserData } from '../types/types';

let timer: undefined | number = undefined;
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
}

export function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

export function checkTime(getUser: UserData) {
  let hrs = returnStringValue(hours);
  let mins = returnStringValue(minutes);
  let secs = returnStringValue(seconds);

  if (hrs !== '00') {
    getUser.time = `${hrs} ${pluralize(hours, 'hour')} ${mins} ${pluralize(
      minutes,
      'minute'
    )} ${secs} ${pluralize(seconds, 'second')}`;
  } else if (mins !== '00') {
    getUser.time = `${mins} ${pluralize(minutes, 'minute')} ${secs} ${pluralize(
      seconds,
      'second'
    )}`;
  } else {
    getUser.time = `${secs} ${pluralize(seconds, 'second')}`;
  }
}

function pluralize(value: number, word: string) {
  return returnStringValue(value) <= '01' ? word : word + 's';
}

export function clearData() {
  localStorage.removeItem('quizWhiz-user-data');

  timer = undefined;
  isRunning = false;

  hours = 0;
  minutes = 0;
  seconds = 0;
}

export function returnStringValue(value: number) {
  return value.toString().padStart(2, '0');
}
