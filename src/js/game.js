import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft;
let winCount;

const createPlaceholdersHTML = () => {
  const word = sessionStorage.getItem("word");
  const wordArr = Array.from(word);
  const placeholdersHTML = wordArr.reduce(
    (acc, curr, i) => acc + `<h1 id=letter_${i} class='letter'>_</h1>`,
    ""
  );
  return `<div id='placeholders' class='placeholders-wrapper'>${placeholdersHTML}</div>`;
};

const createKeyboard = () => {
  const keyboardElement = document.createElement("div");
  keyboardElement.classList.add("keyboard");
  keyboardElement.id = "keyboard";

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button id='${curr}' class='button-primary keyboard-button'>${curr}</button>`
    );
  }, "");

  keyboardElement.innerHTML = keyboardHTML;
  return keyboardElement;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "Hangman image";
  image.classList.add("hangman-img", "mx-auto");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letterId) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letterId.toLowerCase();

  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left");
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft == 0) {
      stopGame("lose");
    }
  } else {
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, index) => {
      if (currentLetter.toLowerCase() == inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame("win");
          return;
        }
        document.getElementById(`letter_${index}`).innerText =
          currentLetter.toUpperCase();
      }
    });
  }
};

const stopGame = (status) => {
  document.getElementById("keyboard").remove();
  document.getElementById("placeholders").remove();
  document.getElementById("tries").remove();
  document.getElementById("quit").remove();

  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = `images/hg-win.png`;
    document.getElementById(
      "game"
    ).innerHTML += `<h2 class='result-header win'>You won :)</h2>`;
  } else if (status === "lose") {
    document.getElementById(
      "game"
    ).innerHTML += `<h2 class='result-header lose'>You lose :(</h2>`;
  } else if (status === "quit") {
    logoH1.classList.remove("logo-sm");
    document.getElementById("hangman-img").remove();
  }
  document.getElementById(
    "game"
  ).innerHTML += `<p class='result-word'>The word was: <span>${word}</span></p><button id="play-again" class='button-primary px-5 py-3 mt-5 mx-auto'>Play again</button>`;

  document.getElementById("play-again").onclick = starGame;
};

export const starGame = () => {
  triesLeft = 10;
  winCount = 0;
  logoH1.classList.add("logo-sm");

  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);

  const keyboardDiv = createKeyboard();

  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  gameDiv.innerHTML = createPlaceholdersHTML();

  gameDiv.innerHTML += `<p id="tries" class="mt-2 flex justify-center">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

  const hangmanImg = createHangmanImg();

  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv);

  gameDiv.insertAdjacentHTML(
    "beforeend",
    '<button id="quit" class="button-secondary block mx-auto px-2 py-1 mt-4 w-20">Quit</button>'
  );

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit and lose progress?");
    if (isSure) {
      stopGame("quit");
    }
  };
};
