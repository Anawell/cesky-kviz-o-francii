// DOM Elements
const buttonNext = document.querySelector(".ak-btn-next");
const buttonSubmit = document.getElementById("ak-btn-submit");
const slides = document.querySelectorAll(".js-slide");
const resultsSlide = document.getElementById("ak-results");
const bgInject = document.getElementById("kviz");
const listOfCorrectAnswers = document.getElementById("results-list");
const tropheeImgDisplay = document.getElementById("ak-trophee");
const scoreDisplay = document.getElementById("result-score");

const answersQuestions = ["Louis Pasteur", "Pain au chocolat a Chocolatine", "Ano", "La Loire", "Obrázky 1 a 3"];
const totalCorrectAnswers = 7;

let currentSlide = 0;


// EventListeners

buttonNext.addEventListener("click", showNextSlide);
buttonNext.addEventListener("keyup", e => {
    if(e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'Enter') {
        showNextSlide();
    }
});

buttonSubmit.addEventListener("click", submitQuiz);
buttonSubmit.addEventListener("keyup", e => {
    if(e.key === 'Enter') {
        submitQuiz();
    }
});


// Polyfill forEach on NodeList
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}


// init
createSlider(0);
limitCheck();



function createSlider(n) {

  slides[currentSlide].classList.remove('ak-slide-active');
  slides[n].classList.add('ak-slide-active');
  currentSlide = n;
  if(currentSlide === slides.length - 1){
    buttonNext.style.display = 'none';
    buttonSubmit.classList.remove('ak-submit-disabled');
  } else {
    buttonNext.style.display = 'inline-flex';
    buttonSubmit.classList.add('ak-submit-disabled');
  }
}


function showNextSlide() {

  createSlider(currentSlide + 1);

}


// limit the numbers of check possible in Question 5

function limitCheck() {

  const inputCheck = document.getElementsByName("q5");
  const CHECK_LIMIT = 2;

  inputCheck.forEach(input => {
    input.onclick = function() {
      let checkedCount = 0;
      inputCheck.forEach(inputChecked => {
        checkedCount += (inputChecked.checked) ? 1 : 0;
      })
      if (checkedCount > CHECK_LIMIT) {
        alert("Můžete vybrat maximálně " + CHECK_LIMIT + " obrázky.");
        this.checked = false;
      }

    }
  })
  
}


// set the value yep or nope if answer is correct or false

function setValueAnswers() {

  const falseAnswers = document.getElementsByClassName('ak-inputs');
  const rightAnswers = document.getElementsByClassName('ak-input');
  
  for (const falseAnswer of falseAnswers) {
    falseAnswer.value = "nope";
  }

  for (const rightAnswer of rightAnswers) {
    rightAnswer.value = "yep";
  }

}


// display the total score

function displayTheScore(numberOfCorrectAnswers) {

  let resultScoreSentence = `Vaše celkové skóre je:
  <span class="ak-highlight">${numberOfCorrectAnswers}</span>
  / ${totalCorrectAnswers};`

  scoreDisplay.innerHTML = resultScoreSentence;

}

// return the good answer and number of points for a question

function returnGoodAnswer(indexQuestion, countPoint) {

  const goodAnswerText = `
    <li>
      <strong>
        Vaše skóre na otázku
        <span class="ak-red-color">č. ${indexQuestion}</span>
        bylo
        <span class="ak-red-color">${countPoint}</span>
      </strong>.
      <br/>
      &mdash; Správná odpověď byla:
      <strong>${answersQuestions[indexQuestion-1]}</strong>
    </li>
  `;
  return goodAnswerText;

}


// display the matching picture depending on victory, fail or between

function displayTheMatchingTrophee(numberOfCorrectAnswers) {

  const tropheeImg = document.createElement('img');
  tropheeImg.style.width = '150';

  if(numberOfCorrectAnswers > 4) {
    tropheeImg.src = "./img/success.gif";
    tropheeImg.alt = "Dva muži dělají vítězný tanec";
  } else if(numberOfCorrectAnswers < 0) {
    tropheeImg.src = "./img/nope.gif";
    tropheeImg.alt = "Muž mává prstem vaším směrem a napodobuje „ne, ne“";
  } else {
    tropheeImg.src = "./img/bof.gif";
    tropheeImg.alt = "Muž se na vás dívá šokovaně i zoufale";
  }

  tropheeImgDisplay.appendChild(tropheeImg);

}


// display the results

function displayResults() {

  let correctAnswers = 0;

  for(let i = 1; i <= answersQuestions.length; i++) {

    let inputQuestions = document.getElementsByName('q'+ i);
    let countPoint = 0;

    inputQuestions.forEach( input => {
      if(input.value == "yep" && input.checked) {
        correctAnswers++;
        countPoint++;
      } else if(input.value !== "yep" && input.checked) {
        correctAnswers--;
        countPoint--;
      }
    })

  const goodAnswerText = returnGoodAnswer(i, countPoint);
  listOfCorrectAnswers.innerHTML += goodAnswerText;
  countPoint = 0;

  }
  
  displayTheMatchingTrophee(correctAnswers);
  displayTheScore(correctAnswers);

}


function submitQuiz() {

  setValueAnswers();
  displayResults();

  bgInject.classList.add('ak-bg-inject');
  buttonSubmit.classList.add('ak-submit-disabled');
  slides[currentSlide].classList.remove('ak-slide-active');
  resultsSlide.classList.add('ak-slide-active');

}
