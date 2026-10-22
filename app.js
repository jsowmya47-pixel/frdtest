
const questions = [
  {
    q: "Who texts first after a fight?",
    a: ["Me 😭", "sonu❤️", "Neither 💀"],
    correct: 1
  },
  {
    q: "What is Sonu's favourite movie?",
    a: ["Rom-com ❤️", "thriller👻", "horror 🫣"],
    correct: 2
  },
  {
    q: "Who is more dramatic?",
    a: ["Sonu ❤️", "Me 🎭", "Both of us 🔥"],
    correct: 1
  },
  {
    q: "What is Sonu's favourite food of all time?",
    a: ["Pizza 🍕", "Chocolates 🍫", "Biryani 🍛"],
    correct: 2
  },
  {
    q: "How long will our friendship last?",
    a: ["Let's see 👀", "Forever ❤️", "Until the next fight 💀"],
    correct: 1
  },
  {
    q: "What do you like most about Sonu?",
    a: ["Her smile 😊", "Her eyes 👀", "All of her 😘"],
    correct: 2
  }
];

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const leaderboard = document.getElementById("leaderboard");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

// Create the questions
questions.forEach((question, index) => {
  const section = document.createElement("div");
  section.className = "question";

  const title = document.createElement("p");
  title.textContent = `${index + 1}. ${question.q}`;
  section.appendChild(title);

  question.a.forEach((answer, answerIndex) => {
    const label = document.createElement("label");
    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = `q${index}`;
    radio.value = answerIndex;

    label.append(radio, document.createTextNode(answer));
    section.appendChild(label);
  });

  quiz.appendChild(section);
});

// Read saved scores
function getScores() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("friendzoneScores") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Display leaderboard
function renderLeaderboard() {
  const scores = getScores().sort(
    (a, b) => b.score - a.score
  );

  leaderboard.replaceChildren();

  if (scores.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No scores yet. Play first! ❤️";
    leaderboard.appendChild(item);
    return;
  }

  scores.slice(0, 50).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.name} — ${entry.score}/120`;
    leaderboard.appendChild(item);
  });
}

// Submit the quiz
submitBtn.addEventListener("click", () => {
  const name = document.getElementById("playerName")
    .value.trim();

  if (!name) {
    result.textContent = "Enter your name first! ❤️";
    return;
  }

  const answers = questions.map((_, index) =>
    document.querySelector(
      `input[name="q${index}"]:checked`
    )
  );

  if (answers.some((answer) => !answer)) {
    result.textContent = "Please answer all 6 questions! 👀";
    return;
  }

  // Give 20 points for every correct answer
  const score = answers.reduce((total, answer, index) => {
    return total +
      (Number(answer.value) === questions[index].correct ? 20 : 0);
  }, 0);

  // Save the player's score
  const entry = {
    name: name.slice(0, 24),
    score: score,
    date: new Date().toISOString()
  };

  try {
    const scores = getScores();
    scores.push(entry);

    localStorage.setItem(
      "friendzoneScores",
      JSON.stringify(scores)
    );
  } catch {
    result.textContent = "Unable to save the score in this browser.";
    return;
  }

  result.textContent =
    `${entry.name}, your score is ${score}/120! ❤️‍🔥`;

  // Remove the previous answer review
  document.querySelector(".answer-review")?.remove();

  // Create answer review
  const review = document.createElement("div");
  review.className = "answer-review";

  const heading = document.createElement("h3");
  heading.textContent = "Sonu Test — Answer Review 💗";
  review.appendChild(heading);

  questions.forEach((question, index) => {
    const chosen = Number(answers[index].value);
    const isCorrect = chosen === question.correct;

    const line = document.createElement("p");

    line.textContent =
      `${index + 1}. ${question.q}\n` +
      `Your answer: ${question.a[chosen]}\n` +
      `Correct answer: ${question.a[question.correct]}\n` +
      (isCorrect
        ? "💖 Correct! +20 points"
        : "🥹 Incorrect! +0 points");

    review.appendChild(line);
  });

  quiz.appendChild(review);
  renderLeaderboard();
});

// Clear saved scores
clearBtn.addEventListener("click", () => {
  if (confirm("Delete all scores saved in this browser?")) {
    localStorage.removeItem("friendzoneScores");
    result.textContent = "Local scores cleared ❤️";
    document.querySelector(".answer-review")?.remove();
    renderLeaderboard();
  }
});

// Show existing scores on page load
renderLeaderboard();

