const countDownElement = document.querySelector('.event-countDown');

// Target Date August 27 
const currentYear = new Date().getFullYear();
const targetTime = new Date(`${currentYear}-08-27T16:00:00`).getTime();

let timerInterval;

function updateCountDown() {
  const now = new Date().getTime();
  const distance = targetTime - now;

  // Stop countdown at 00d 00h 00m 00s
  if (distance <= 0) {
    countDownElement.textContent = "00d 00h 00m 00s";
    clearInterval(timerInterval);
    return;
  }

  //convert distance to days, hours, minutes, and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //Two digit formating
  countDownElement.textContent =
    String(days).padStart(2, '0') + 'd ' +
    String(hours).padStart(2, '0') + 'h ' +
    String(minutes).padStart(2, '0') + 'm ' +
    String(seconds).padStart(2, '0') + 's';
}

//user can see the countdown as 1 second interval
updateCountDown();
timerInterval = setInterval(updateCountDown, 1000);
