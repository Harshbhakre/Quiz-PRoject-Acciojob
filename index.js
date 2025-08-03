document.addEventListener("DOMContentLoaded", () => {
  const quizDiv = document.querySelector("#quiz-page");

  const urlParams = new URLSearchParams(window.location.search);
  const categoryKey = urlParams.get("type");

  if (!categoryKey) {
    quizDiv.innerHTML = "<h1 class='text-white text-2xl'>Invalid Category</h1>";
    return;
  }

  fetch("./assets/quizData.json")
    .then((response) => response.json())
    .then((quizData) => {
      const category = quizData[categoryKey];

      if (!category) {
        quizDiv.innerHTML =
          "<h1 class='text-white text-2xl'>Category Not Found</h1>";
        return;
      }

      renderQuestions(category);
    })
    .catch((error) => {
      console.error("Error loading quiz:", error);
      quizDiv.innerHTML =
        "<h1 class='text-white text-2xl'>Failed to load quiz data.</h1>";
    });

  function renderQuestions(category) {
    let questionNumber = 0;
    let score = 0;
    let selected = false;
    function showQuestion() {
      selected = false;
      if (questionNumber >= category.length) {
        localStorage.setItem("finalScore", score);
        window.location.href = "./result.html";
        return;
      }

      const question = category[questionNumber];

      if (question.type === "mcq") {
        quizDiv.innerHTML = `
        <h4 id="scoreid" class="absolute top-5 right-10 z-10 text-white text-xl font-bold">Score: ${score}</h4>
          <div class="leading-[1.15] h-60 w-full flex flex-col items-center justify-center">
            <p class="text-[1.7rem] text-white font-semibold">Question ${
              questionNumber + 1
            }</p>
            <h1 class="text-[2.5rem] text-center text-white font-semibold m-4">${
              question.question
            }</h1>
            <div id="options" class="flex flex-col items-center justify-center gap-y-2 w-140">
              ${question.options
                .map(
                  (opt) => `
                <div class="checkAns bg-[#facd3a] flex justify-center items-center border-1 border-black rounded-sm h-8 w-70 md:w-full cursor-pointer text-[1rem] hover:scale-105 hover:bg-[#fb3259] hover:text-white hover:shadow-xl duration-300 shadow-lg">${opt}</div>`
                )
                .join("")}
                <p id="feedback" class="h-10 text-[1.5rem] text-white font-semibold"></p>
            </div>
            <button class="next-ques mt-10 bg-[#81c0ff] p-2 px-4 rounded-sm md:text-[1rem] text-[1.5rem] cursor-pointer hover:bg-white">Next</button>
          </div>`;
      } else {
        quizDiv.innerHTML = `
        <h4 class="absolute top-5 right-10 z-10 text-white text-xl font-bold">Score: ${score}</h4>
          <div class="leading-[1.15] h-60 w-full flex flex-col items-center justify-center">
            <p class="text-[1.7rem] text-white font-semibold">Question ${
              questionNumber + 1
            }</p>
            <h1 class="text-[2.5rem] text-white text-center font-semibold m-4">${
              question.question
            }</h1>
            <input type="${question.inputType}" placeholder="Your Answer"
             class="inpVal shadow-lg pl-2 bg-white border-1 border-white rounded-sm h-12 md:h-12 md:w-1/3 w-70 py-2 text-[1rem] hover:scale-105 duration-300">
            <button class="CheckAnsInp mt-4 bg-[#81c0ff] p-2 px-4 rounded-sm md:text-[1rem] text-[1.5rem]  cursor-pointer hover:bg-white">Submit</button>
            <p id="feedback"></p>
            <button class="next-ques mt-10 bg-[#C3E2FF] p-2 px-4 rounded-sm md:text-[1rem] text-[1.5rem] cursor-pointer hover:bg-white">Next</button>
          </div>`;
      }

      document.querySelector(".next-ques").addEventListener("click", () => {
        if (selected) {
          questionNumber++;
          showQuestion();
        }
      });
      if (question.type === "mcq") {
        let optionDiv = document.querySelectorAll(".checkAns");
        optionDiv.forEach((div, idx) => {
          div.setAttribute("id", idx);
          div.addEventListener("click", () => {
            if (!selected) {
              let feedback = document.querySelector("#feedback")
              if (
                question.options.indexOf(question.answer) ==
                div.getAttribute("id")
              ) {
              feedback.setAttribute("class","h-10 text-[1.5rem] text-[#74db1a] font-semibold")
              feedback.innerHTML="Correct"
              score++;
              document.querySelector("#scoreid").innerHTML= `Score: ${score}`
              }else{
                feedback.setAttribute("class","h-10 text-[1.5rem] text-[#FF475D] font-semibold")
                feedback.innerHTML="Wrong"
              }
              selected = true;
            }
          });
        });
      } else {
        let inpSubmite = document.querySelector(".CheckAnsInp");
        inpSubmite.addEventListener("click", () => {
          if (!selected) {
            let feedback = document.querySelector("#feedback")
            if (
              (question.inputType == "text"
                ? question.answer.toLowerCase()
                : question.answer) ===
              (question.inputType == "text"
                ? document.querySelector(".inpVal").value.trim().toLowerCase()
                : parseInt(document.querySelector(".inpVal").value))
            ) {
              feedback.setAttribute("class","h-10 text-[1.5rem] text-[#74db1a] font-semibold")
              feedback.innerHTML="Correct"
              score++;
            }else{
              feedback.setAttribute("class","h-10 text-[1.5rem] text-[#FF475D] font-semibold")
              feedback.innerHTML="Wrong"
            }
            selected = true;
          }
        });
      }
    }
    showQuestion();
    function renderResult() {
      let resultDiv = document.querySelector("#result");
      resultDiv.innerHTML = `
      <div class="mt-30 leading-[1.15] mb-30 h-60 w-full flex flex-col items-center justify-center">
        <P class="text-[1.7rem] font-semibold">Bravo! You have Scored</P>
        <h1 id="score" class="text-[10rem] font-semibold text-white">${score}/10</h1>
        <a href="/index.html" class="font-semibold cursor-pointer hover:underline flex text-[1.5rem]">Wanna Play Again?</a>
        </div>
      `;
    }
  }
});
